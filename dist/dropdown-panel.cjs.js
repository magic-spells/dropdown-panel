'use strict';

/**
 * @file Shared unique-id generator for every dropdown element.
 *
 * A single module-level counter is deliberate: two independent counters
 * (one in dropdown-component, one in dropdown-trigger) both minted
 * `dropdown-trigger-N` ids and collided at runtime, which silently
 * pointed `aria-labelledby` at the wrong element.
 */

let counter = 0;

/**
 * Returns the root node that owns id lookups for an element, when there
 * is one (Document, ShadowRoot and DocumentFragment all expose
 * getElementById; a detached element chain does not).
 * @param {Element} element - element to resolve the id scope for
 * @returns {Document | ShadowRoot | DocumentFragment | null}
 */
function getIdScope(element) {
	const root = element.getRootNode();
	return typeof root?.getElementById === 'function' ? root : null;
}

/**
 * Generates the next id for a prefix that is unused within a scope.
 * @param {string} prefix - id prefix, e.g. 'dropdown-panel'
 * @param {Document | ShadowRoot | DocumentFragment | null} [scope] - root to check against
 * @returns {string} an unused id
 */
function nextId(prefix, scope = null) {
	let id = `${prefix}-${++counter}`;
	while (scope && scope.getElementById(id)) {
		id = `${prefix}-${++counter}`;
	}
	return id;
}

/**
 * Ensures an element carries an id that is unique inside its root.
 *
 * The id is re-minted when it is missing OR already claimed by a
 * different element — that second case is what stops a
 * `cloneNode(true)` copy of a connected dropdown from inheriting the
 * original's ids and breaking aria-controls / aria-labelledby.
 * @param {Element} element - element to assign an id to
 * @param {string} prefix - id prefix, e.g. 'dropdown-trigger'
 * @returns {string} the element's id
 */
function ensureId(element, prefix) {
	const scope = getIdScope(element);
	const currentId = element.getAttribute('id');
	const isUnique =
		currentId &&
		(!scope || scope.getElementById(currentId) === element);

	if (!isUnique) element.id = nextId(prefix, scope);

	return element.id;
}

const HOVER_QUERY = '(hover: hover)';

// elements inside a panel that arrow navigation can land on
const FOCUSABLE_SELECTOR = [
	'a[href]',
	'button:not([disabled])',
	'input:not([disabled]):not([type="hidden"])',
	'select:not([disabled])',
	'textarea:not([disabled])',
	'dropdown-trigger',
	'[tabindex]:not([tabindex="-1"])',
].join(',');

// what counts as an item in `menu` mode. Separators, group labels and
// plain text never match the selector, so they are skipped for free.
const MENU_ITEM_SELECTOR = [
	'button:not([disabled])',
	'a[href]',
	'[role="menuitem"]',
	'[role="menuitemcheckbox"]',
	'[role="menuitemradio"]',
	'dropdown-trigger', // a nested submenu's trigger is a menuitem
].join(',');

// how long a typeahead buffer survives without another keystroke
const TYPEAHEAD_TIMEOUT = 500;

// how long a touch has to rest before it counts as a long press
const LONG_PRESS_DELAY = 500;

// how far a touch may travel before it stops being a long press
const LONG_PRESS_SLOP = 10;

// gap kept between a pointer-placed panel and the viewport edge
const VIEWPORT_MARGIN = 8;

// arrow keys belong to these elements, not to the menu
const TEXT_ENTRY_SELECTOR =
	'input, textarea, select, [contenteditable=""], [contenteditable="true"]';

/**
 * Main dropdown component. Orchestrates a <dropdown-trigger> and a
 * <dropdown-panel> that are direct children of it.
 *
 * The `visible` attribute on this element is the single source of truth
 * for shown state. `aria-expanded` on the trigger, `aria-hidden` and
 * `inert` on the panel are derived outputs — never inputs.
 *
 * @class DropdownComponent
 * @extends HTMLElement
 * @fires DropdownComponent#dropdown-panel:before-show
 * @fires DropdownComponent#dropdown-panel:show
 * @fires DropdownComponent#dropdown-panel:before-hide
 * @fires DropdownComponent#dropdown-panel:hide
 */
class DropdownComponent extends HTMLElement {
	static observedAttributes = [
		'visible',
		'open-delay',
		'close-delay',
	];

	// every currently shown dropdown on the page — used to close siblings
	static #shown = new Set();

	#ready = false;
	#visible = false;
	#reflecting = false;
	#openSource = null;
	#hoverSuppressed = false;
	#pointerDismissed = false;
	#observer = null;
	#validationTimer = null;
	#openDelay = 0;
	#closeDelay = 0;
	#hoverTimer = null;
	#typeBuffer = '';
	#typeTimer = null;
	#pointerPos = null;
	#returnTarget = null;
	#pressTimer = null;
	#pressOrigin = null;

	constructor() {
		super();
		this.handlers = {};
	}

	/**
	 * Whether the panel is currently shown.
	 * @returns {boolean}
	 */
	get visible() {
		return this.hasAttribute('visible');
	}

	/**
	 * Shows or hides the panel.
	 * @param {boolean} value - true to show, false to hide
	 */
	set visible(value) {
		if (value) this.show();
		else this.hide();
	}

	/**
	 * Resolved value of the `open-delay` attribute, in milliseconds.
	 * @returns {number}
	 */
	get openDelay() {
		return this.#openDelay;
	}

	/**
	 * Resolved value of the `close-delay` attribute, in milliseconds.
	 * @returns {number}
	 */
	get closeDelay() {
		return this.#closeDelay;
	}

	/**
	 * Resolved value of the `trigger` attribute.
	 * @returns {'hover' | 'click' | 'both' | 'contextmenu'}
	 */
	get triggerMode() {
		const mode = this.getAttribute('trigger');
		return mode === 'hover' ||
			mode === 'click' ||
			mode === 'contextmenu'
			? mode
			: 'both';
	}

	/**
	 * Whether the component is in application-menu mode.
	 * @returns {boolean}
	 * @private
	 */
	#isMenu() {
		return this.hasAttribute('menu');
	}

	/**
	 * When the element is connected to the dom.
	 *
	 * For an already-defined custom element this fires at start-tag time,
	 * before the children are parsed, so setup is retried lazily rather
	 * than abandoned.
	 */
	connectedCallback() {
		if (!this.#setup()) this.#waitForChildren();
	}

	/**
	 * Cleans up listeners, observers and global state.
	 */
	disconnectedCallback() {
		const _ = this;

		_.detachListeners();
		_.#detachDocumentListeners();
		_.#clearHoverTimer();
		_.#clearLongPress();
		_.#clearTypeahead();
		_.#clearDismissed();
		DropdownComponent.#shown.delete(_);

		_.#observer?.disconnect();
		_.#observer = null;

		clearTimeout(_.#validationTimer);
		document.removeEventListener(
			'DOMContentLoaded',
			_.handlers.validate
		);

		// a re-connected element re-runs setup and re-binds listeners
		_.#ready = false;
		_.#visible = false;
		_.#openSource = null;
	}

	/**
	 * Reacts to consumer-driven changes of the `visible` attribute.
	 * @param {string} name - attribute name
	 * @param {string | null} previousValue - value before the change
	 * @param {string | null} currentValue - value after the change
	 */
	attributeChangedCallback(name, previousValue, currentValue) {
		if (name === 'open-delay' || name === 'close-delay') {
			// non-numeric, negative and absent all mean "no delay"
			const ms = Number(currentValue);
			const delay = ms > 0 ? ms : 0;
			if (name === 'open-delay') this.#openDelay = delay;
			else this.#closeDelay = delay;
			return;
		}

		if (name !== 'visible') return;
		if (this.#reflecting) return;
		if (previousValue === currentValue) return;

		if (currentValue !== null) this.show();
		else this.hide();
	}

	/**
	 * Queries and caches the direct child trigger and panel.
	 * @returns {boolean} true when both were found
	 */
	queryDOM() {
		const _ = this;

		_.trigger = _.querySelector(':scope > dropdown-trigger');
		_.panel = _.querySelector(':scope > dropdown-panel');

		// a context menu is opened by a press anywhere in the component,
		// so it needs no <dropdown-trigger> at all
		return (
			Boolean(_.panel) &&
			(Boolean(_.trigger) || _.triggerMode === 'contextmenu')
		);
	}

	/**
	 * Wires up the aria relationships between trigger and panel.
	 */
	setupAria() {
		const _ = this;
		const menu = _.#isMenu();
		const panelId = ensureId(_.panel, 'dropdown-panel');

		// role="group" so the panel can carry an accessible name — a
		// role-less custom element cannot. Deliberately not a menu role
		// unless the consumer opted into `menu`.
		if (!_.panel.hasAttribute('role')) {
			_.panel.setAttribute('role', menu ? 'menu' : 'group');
		}

		// a context menu may have no trigger to label the panel with
		if (!_.trigger) return;

		const triggerId = ensureId(_.trigger, 'dropdown-trigger');

		_.trigger.setAttribute('aria-controls', panelId);
		_.trigger.setAttribute('aria-haspopup', menu ? 'menu' : 'true');
		_.panel.setAttribute('aria-labelledby', triggerId);
	}

	/**
	 * Binds every listener the component owns while connected.
	 */
	attachListeners() {
		const _ = this;

		_.handlers.pointerEnter = (event) => {
			if (event.pointerType === 'touch') return;
			if (_.triggerMode === 'click') return;
			if (_.#hoverSuppressed) return;
			// also cancels a pending close, which is what lets the pointer
			// cross a gap the hover bridge does not cover
			_.#clearHoverTimer();
			_.#afterDelay(_.#openDelay, () => _.#open('hover'));
		};

		_.handlers.pointerLeave = (event) => {
			if (event.pointerType === 'touch') return;
			_.#hoverSuppressed = false;
			// cancels a pending open
			_.#clearHoverTimer();
			// click- and keyboard-opened panels stay put until they are
			// dismissed deliberately — and so ignore close-delay
			if (_.#openSource !== 'hover') return;
			_.#afterDelay(_.#closeDelay, () => _.hide());
		};

		_.handlers.triggerClick = (event) => {
			if (!_.#setup()) return;
			if (!_.#clickEnabled()) return;
			// never swallow activation of a real control inside the trigger
			if (_.#isInteractiveDescendant(event.target)) return;

			// a click never waits, and never leaves a pending close to
			// strand the panel shut under the cursor
			_.#clearHoverTimer();

			if (!_.#visible) {
				_.#open('click');
				return;
			}

			// a hover-opened panel latches instead of closing: closing it
			// here would strand it shut, because pointerenter cannot fire
			// again while the pointer is still inside
			if (_.#openSource === 'hover') {
				_.#openSource = 'click';
				return;
			}

			_.hide();
			_.#hoverSuppressed = true;
		};

		_.handlers.triggerKeydown = (event) =>
			_.#handleTriggerKeydown(event);

		_.handlers.documentPointerDown = (event) => {
			if (_.contains(event.target)) return;
			_.#dismiss();
		};

		_.handlers.documentKeydown = (event) => _.#handleKeydown(event);

		// one shared handler for both ends of a recorded dismissal: the
		// click that completes the press, and any press that starts a
		// new interaction without one
		_.handlers.endDismissal = () => _.#clearDismissed();

		// a right-click surface has no hover path: the press is the whole
		// interaction
		_.handlers.contextMenu = (event) => {
			// a text field keeps its native menu — cut/copy/paste/spellcheck
			if (event.target?.closest?.(TEXT_ENTRY_SELECTOR)) return;
			event.preventDefault();
			_.#clearLongPress();
			_.showAt(event.clientX, event.clientY);
		};

		_.handlers.pressStart = (event) => {
			if (event.pointerType !== 'touch') return;
			_.#startLongPress(event);
		};

		_.handlers.pressMove = (event) => {
			if (!_.#pressOrigin) return;
			const dx = event.clientX - _.#pressOrigin.x;
			const dy = event.clientY - _.#pressOrigin.y;
			if (Math.hypot(dx, dy) > LONG_PRESS_SLOP) _.#clearLongPress();
		};

		_.handlers.pressEnd = () => _.#clearLongPress();

		// one delegated listener turns any activation inside the panel
		// into a `select`, menu mode only
		_.handlers.panelClick = (event) => _.#handlePanelClick(event);

		if (_.triggerMode === 'contextmenu') {
			_.addEventListener('contextmenu', _.handlers.contextMenu);
			_.addEventListener('pointerdown', _.handlers.pressStart);
			_.addEventListener('pointermove', _.handlers.pressMove);
			_.addEventListener('pointerup', _.handlers.pressEnd);
			_.addEventListener('pointercancel', _.handlers.pressEnd);
		} else {
			_.addEventListener('pointerenter', _.handlers.pointerEnter);
			_.addEventListener('pointerleave', _.handlers.pointerLeave);
		}

		if (_.#isMenu()) {
			_.panel.addEventListener('click', _.handlers.panelClick);
		}

		_.trigger?.addEventListener('click', _.handlers.triggerClick);
		_.trigger?.addEventListener('keydown', _.handlers.triggerKeydown);
	}

	/**
	 * Unbinds every listener bound by attachListeners().
	 */
	detachListeners() {
		const _ = this;

		_.removeEventListener('pointerenter', _.handlers.pointerEnter);
		_.removeEventListener('pointerleave', _.handlers.pointerLeave);
		_.removeEventListener('contextmenu', _.handlers.contextMenu);
		_.removeEventListener('pointerdown', _.handlers.pressStart);
		_.removeEventListener('pointermove', _.handlers.pressMove);
		_.removeEventListener('pointerup', _.handlers.pressEnd);
		_.removeEventListener('pointercancel', _.handlers.pressEnd);
		_.panel?.removeEventListener('click', _.handlers.panelClick);
		_.trigger?.removeEventListener('click', _.handlers.triggerClick);
		_.trigger?.removeEventListener(
			'keydown',
			_.handlers.triggerKeydown
		);
	}

	/**
	 * Shows the panel. Idempotent, and safe to call on an unconnected or
	 * incomplete element.
	 */
	show() {
		this.#open('api');
	}

	/**
	 * Shows the panel pinned to a point in viewport coordinates, flipped
	 * and clamped so it stays on screen. Used by `trigger="contextmenu"`,
	 * and callable directly for a custom right-click surface.
	 * @param {number} x - clientX to place the panel at
	 * @param {number} y - clientY to place the panel at
	 */
	showAt(x, y) {
		const _ = this;

		_.#pointerPos = { x, y };

		// a second press elsewhere relocates the open panel rather than
		// opening a second one
		if (_.#visible) {
			_.#placeAtPointer();
			if (_.#isMenu()) _.#focusItem(0);
			return;
		}

		_.#returnTarget = document.activeElement;
		_.#open('pointer');
	}

	/**
	 * Focuses a panel item by index. Negative and out-of-range indexes
	 * wrap around.
	 * @param {number} index - item index
	 */
	focusItem(index) {
		this.#focusItem(index);
	}

	/**
	 * Hides the panel. Idempotent, and safe to call on an unconnected or
	 * incomplete element.
	 * @param {Object} [options] - hide options
	 * @param {boolean} [options.restoreFocus=true] - return focus to the
	 *   trigger when focus is currently inside the component
	 */
	hide({ restoreFocus = true } = {}) {
		const _ = this;

		if (!_.#ready) {
			_.#reflect(false);
			return;
		}
		// before the guard: a pending hover open must not survive a hide
		_.#clearHoverTimer();
		_.#clearLongPress();
		if (!_.#visible) return;
		_.#clearTypeahead();
		if (!_.#emit('before-hide', true)) {
			_.#reflect(true);
			return;
		}

		// captured before nested panels close, because closing them can
		// move focus out from under us
		const focusWasInside = _.contains(document.activeElement);

		// a nested panel would otherwise stay "shown" inside an inert
		// parent, keeping its document listeners alive
		for (const other of Array.from(DropdownComponent.#shown)) {
			if (other !== _ && _.contains(other)) {
				other.hide({ restoreFocus: false });
			}
		}

		// move focus out before `inert` lands: inert synchronously blurs
		// any focused descendant to <body>, silently losing the user's
		// place in the tab order
		if (restoreFocus && focusWasInside) {
			// a pointer-opened panel returns focus where it found it
			(_.#returnTarget ?? _.trigger)?.focus({ preventScroll: true });
		}

		_.#visible = false;
		_.#openSource = null;
		_.#returnTarget = null;
		_.#pointerPos = null;
		_.#clearPlacement();
		_.#reflect(false);
		_.#applyState();
		_.#detachDocumentListeners();
		DropdownComponent.#shown.delete(_);

		_.#emit('hide');
	}

	/**
	 * Shows the panel when hidden, hides it when shown.
	 *
	 * A press outside the component closes the panel on `pointerdown`,
	 * which lands before the `click` it produces. An external toggle
	 * button is outside the component, so without the guard below every
	 * one of its clicks would read the already-cleared state and re-open
	 * the panel — leaving it impossible to close.
	 */
	toggle() {
		const _ = this;

		if (!_.#setup()) return;

		// the press behind this click already closed the panel: the
		// interaction as a whole is a close, not a close plus a re-open
		if (_.#pointerDismissed) {
			_.#clearDismissed();
			return;
		}

		if (_.#visible) _.hide();
		else _.#open('api');
	}

	/**
	 * Resolves the trigger and panel and finishes wiring the component.
	 * Idempotent — re-entry never double-binds listeners.
	 * @returns {boolean} true when the component is wired up
	 * @private
	 */
	#setup() {
		const _ = this;

		if (_.#ready) return true;
		if (!_.queryDOM()) return false;

		_.#observer?.disconnect();
		_.#observer = null;
		clearTimeout(_.#validationTimer);

		_.setupAria();

		// initial state is applied directly rather than through hide(),
		// whose idempotency guard would skip it and leave a fresh panel
		// without `inert`
		_.#visible = false;
		_.#applyState();

		_.attachListeners();
		_.#ready = true;

		if (_.hasAttribute('visible')) _.#open('api');

		return true;
	}

	/**
	 * Watches for the trigger and panel to appear, and warns only after a
	 * genuine deferred check — not on the first synchronous miss.
	 * @private
	 */
	#waitForChildren() {
		const _ = this;

		_.#observer = new MutationObserver(() => _.#setup());
		_.#observer.observe(_, { childList: true });

		_.handlers.validate = () => {
			if (_.#setup() || !_.isConnected) return;
			console.warn(
				_.triggerMode === 'contextmenu'
					? 'dropdown-component[trigger="contextmenu"] requires <dropdown-panel> as a direct child'
					: 'dropdown-component requires <dropdown-trigger> and <dropdown-panel> as direct children',
				_
			);
		};

		if (document.readyState === 'loading') {
			// still parsing: the children may simply not be here yet
			document.addEventListener(
				'DOMContentLoaded',
				_.handlers.validate,
				{ once: true }
			);
		} else {
			// created after load: give the caller a full frame plus a task
			// to populate the element before complaining about it
			requestAnimationFrame(() => {
				_.#validationTimer = setTimeout(_.handlers.validate, 0);
			});
		}
	}

	/**
	 * Shows the panel and records what opened it.
	 * @param {'hover' | 'click' | 'keyboard' | 'api' | 'pointer'} source - what opened it
	 * @private
	 */
	#open(source) {
		const _ = this;

		if (!_.#setup()) {
			// children have not parsed yet — record the intent so setup
			// picks it up
			_.#reflect(true);
			return;
		}
		// click, keyboard and api act now, cancelling any pending hover
		// timer — including a pending close on an already-open panel
		_.#clearHoverTimer();
		if (_.#visible) return;
		if (!_.#emit('before-show', true)) {
			_.#reflect(false);
			return;
		}

		_.#closeOthers();

		_.#visible = true;
		_.#openSource = source;
		_.#hoverSuppressed = false;
		// an open panel cannot also be one an outside press just closed
		_.#clearDismissed();
		_.#reflect(true);
		_.#applyState();

		// the panel is non-inert and measurable here, and opacity does not
		// affect layout, so this is the one slot where placement can read
		// real geometry before `show` fires
		if (_.#pointerPos) _.#placeAtPointer();
		else _.#applyFlip();

		_.#syncMenuItems();
		_.#attachDocumentListeners();
		DropdownComponent.#shown.add(_);

		if (source === 'pointer' && _.#isMenu()) _.#focusItem(0);

		_.#emit('show');
	}

	/**
	 * Runs an action now when the delay is zero — today's synchronous
	 * behaviour — or schedules it as the single pending hover timer.
	 * @param {number} delay - milliseconds to wait
	 * @param {Function} action - what to run
	 * @private
	 */
	#afterDelay(delay, action) {
		if (!delay) {
			action();
			return;
		}

		this.#hoverTimer = setTimeout(() => {
			this.#hoverTimer = null;
			action();
		}, delay);
	}

	/**
	 * Cancels a pending hover open or close.
	 * @private
	 */
	#clearHoverTimer() {
		clearTimeout(this.#hoverTimer);
		this.#hoverTimer = null;
	}

	/**
	 * Closes this dropdown in response to a pointer press outside of it,
	 * and records the dismissal so that toggle() can tell the resulting
	 * click apart from a fresh one.
	 * @private
	 */
	#dismiss() {
		const _ = this;

		// hide() cascades into nested panels, so the ones about to close
		// are collected first — each owns a toggle() that has to settle
		// closed too
		const closing = [_];
		for (const other of DropdownComponent.#shown) {
			if (other !== _ && _.contains(other)) closing.push(other);
		}

		_.hide();

		// a canceled before-hide leaves a panel open; only what actually
		// closed remembers the dismissal
		for (const component of closing) {
			if (!component.#visible) component.#markDismissed();
		}
	}

	/**
	 * Remembers that an outside press just closed this panel, until the
	 * interaction that press belongs to is over.
	 * @private
	 */
	#markDismissed() {
		const _ = this;

		_.#pointerDismissed = true;

		// The record is bounded by the interaction itself, not by a
		// timer: the click this press produces ends it. Bound on window
		// rather than document, in the bubble phase, so it runs after
		// every consumer handler on the path — the button's own, and
		// delegated ones on document or on window bound at load time.
		window.addEventListener('click', _.handlers.endDismissal);
		// Presses that never produce a click — a drag, a scroll, a
		// context menu — are released by the next press instead. Capture
		// phase, so it lands before the bubble-phase documentPointerDown
		// that may record a fresh dismissal for the same press.
		document.addEventListener(
			'pointerdown',
			_.handlers.endDismissal,
			{
				capture: true,
			}
		);
	}

	/**
	 * Forgets a recorded dismissal and unbinds what was watching for the
	 * end of it.
	 * @private
	 */
	#clearDismissed() {
		const _ = this;

		_.#pointerDismissed = false;

		window.removeEventListener('click', _.handlers.endDismissal);
		document.removeEventListener(
			'pointerdown',
			_.handlers.endDismissal,
			{
				capture: true,
			}
		);
	}

	/**
	 * Closes every shown dropdown that is neither an ancestor nor a
	 * descendant of this one.
	 * @private
	 */
	#closeOthers() {
		const _ = this;

		for (const other of Array.from(DropdownComponent.#shown)) {
			if (other === _) continue;
			if (other.contains(_) || _.contains(other)) continue;
			other.hide();
		}
	}

	/**
	 * Writes the `visible` attribute without re-entering
	 * attributeChangedCallback.
	 * @param {boolean} visible - target state
	 * @private
	 */
	#reflect(visible) {
		const _ = this;

		_.#reflecting = true;
		if (visible) _.setAttribute('visible', '');
		else _.removeAttribute('visible');
		_.#reflecting = false;
	}

	/**
	 * Pushes the derived aria / inert state onto the trigger and panel.
	 * @private
	 */
	#applyState() {
		const _ = this;
		const visible = _.#visible;

		_.trigger?.setAttribute(
			'aria-expanded',
			visible ? 'true' : 'false'
		);
		// `inert` goes on before `aria-hidden` when hiding: it blurs a focused
		// descendant synchronously, and Chrome warns if aria-hidden lands first
		if (visible) {
			_.panel.removeAttribute('inert');
			_.panel.setAttribute('aria-hidden', 'false');
		} else {
			_.panel.setAttribute('inert', '');
			_.panel.setAttribute('aria-hidden', 'true');
			// cleared so the next open re-measures from scratch
			_.panel.removeAttribute('flipped');
		}
	}

	/**
	 * Dispatches a namespaced custom event.
	 * @param {string} type - event suffix, e.g. 'show'
	 * @param {boolean} [cancelable=false] - whether preventDefault aborts
	 * @returns {boolean} false when the event was canceled
	 * @private
	 */
	#emit(type, cancelable = false) {
		return this.dispatchEvent(
			new CustomEvent(`dropdown-panel:${type}`, {
				bubbles: true,
				cancelable,
				detail: { trigger: this.trigger, panel: this.panel },
			})
		);
	}

	#attachDocumentListeners() {
		const _ = this;

		document.addEventListener(
			'pointerdown',
			_.handlers.documentPointerDown
		);
		document.addEventListener('keydown', _.handlers.documentKeydown);

		// a panel pinned to a point drifts away from it on scroll, so it
		// dismisses instead
		if (_.#openSource === 'pointer') {
			_.handlers.documentScroll = () => _.hide();
			document.addEventListener('scroll', _.handlers.documentScroll, {
				capture: true,
				passive: true,
			});
		}
	}

	#detachDocumentListeners() {
		const _ = this;

		document.removeEventListener(
			'pointerdown',
			_.handlers.documentPointerDown
		);
		document.removeEventListener(
			'keydown',
			_.handlers.documentKeydown
		);
		document.removeEventListener(
			'scroll',
			_.handlers.documentScroll,
			{
				capture: true,
			}
		);
	}

	/**
	 * Pins the panel to the recorded pointer position, flipping it left
	 * and up when it would overflow, then clamping it to the viewport.
	 * @private
	 */
	#placeAtPointer() {
		const _ = this;
		const panel = _.panel;
		const pos = _.#pointerPos;

		if (!panel || !pos) return;

		panel.style.position = 'fixed';

		const { width, height } = panel.getBoundingClientRect();
		const vw = window.innerWidth;
		const vh = window.innerHeight;
		const m = VIEWPORT_MARGIN;

		let left = pos.x;
		let top = pos.y;

		if (left + width > vw - m) left = pos.x - width;
		if (top + height > vh - m) top = pos.y - height;

		// a panel taller or wider than the viewport pins to the margin
		// rather than hanging off the near edge
		left = Math.min(Math.max(left, m), Math.max(m, vw - width - m));
		top = Math.min(Math.max(top, m), Math.max(m, vh - height - m));

		panel.style.left = `${left}px`;
		panel.style.top = `${top}px`;
	}

	/**
	 * Drops the inline styles #placeAtPointer() wrote.
	 * @private
	 */
	#clearPlacement() {
		const style = this.panel?.style;
		if (!style) return;

		style.position = '';
		style.left = '';
		style.top = '';
	}

	/**
	 * Opt-in collision handling: measures once per open and flips a panel
	 * that would run past the bottom of the viewport.
	 * @private
	 */
	#applyFlip() {
		const _ = this;
		const panel = _.panel;

		if (!panel?.hasAttribute('flip')) return;
		// a sideways panel is anchored by `top: 0`, so a `bottom: 100%`
		// would constrain both edges and collapse it
		if (_.#opensRight()) return;

		// measure un-flipped, so a reopen higher up returns to downward
		panel.removeAttribute('flipped');

		const rect = panel.getBoundingClientRect();
		const anchor = (_.trigger ?? _).getBoundingClientRect();

		if (
			rect.bottom > window.innerHeight - VIEWPORT_MARGIN &&
			anchor.top - rect.height >= VIEWPORT_MARGIN
		) {
			panel.setAttribute('flipped', '');
		}
	}

	/**
	 * Starts the touch long-press that stands in for a right-click.
	 * @param {PointerEvent} event - the pointerdown that began the press
	 * @private
	 */
	#startLongPress(event) {
		const _ = this;

		_.#clearLongPress();
		_.#pressOrigin = { x: event.clientX, y: event.clientY };
		_.#pressTimer = setTimeout(() => {
			_.#pressTimer = null;
			const origin = _.#pressOrigin;
			_.#clearLongPress();
			if (origin) _.showAt(origin.x, origin.y);
		}, LONG_PRESS_DELAY);

		document.addEventListener('scroll', _.handlers.pressEnd, {
			capture: true,
			passive: true,
		});
	}

	/**
	 * Cancels a pending long press.
	 * @private
	 */
	#clearLongPress() {
		const _ = this;

		clearTimeout(_.#pressTimer);
		_.#pressTimer = null;
		_.#pressOrigin = null;
		document.removeEventListener('scroll', _.handlers.pressEnd, {
			capture: true,
		});
	}

	/**
	 * Stamps menu roles and rewrites the roving tabindex so exactly one
	 * item is a tab stop. No-op outside menu mode.
	 * @param {number} [activeIndex=0] - the item that carries tabindex="0"
	 * @private
	 */
	#syncMenuItems(activeIndex = 0) {
		const _ = this;

		if (!_.#isMenu()) return;

		// disabled items are stamped too — inside role="menu" a role-less
		// child is invalid, and a tabbable one would be a second tab stop
		// — but they never rove and never carry the tab stop
		const active = _.#focusableItems();
		const items = Array.from(
			_.panel.querySelectorAll(
				MENU_ITEM_SELECTOR + ',button[disabled]'
			)
		).filter(
			(element) => element.closest('dropdown-panel') === _.panel
		);

		items.forEach((element) => {
			if (element.matches('dropdown-trigger')) {
				// <dropdown-trigger> assigns itself role="button"; inside a
				// menu the meaningful role is menuitem
				if (element.getAttribute('role') === 'button') {
					element.setAttribute('role', 'menuitem');
				}
				if (element.parentElement?.hasAttribute('menu')) {
					element.setAttribute('aria-haspopup', 'menu');
				}
			}

			if (!element.hasAttribute('role')) {
				element.setAttribute('role', 'menuitem');
			}

			const index = active.indexOf(element);
			element.setAttribute(
				'tabindex',
				index !== -1 && index === activeIndex ? '0' : '-1'
			);
		});
	}

	/**
	 * Turns a click on a menu item into a `dropdown-panel:select`.
	 * @param {MouseEvent} event - the delegated click
	 * @private
	 */
	#handlePanelClick(event) {
		const _ = this;
		const item = event.target?.closest?.(MENU_ITEM_SELECTOR);

		if (!item) return;
		// items belonging to a nested panel are that panel's business
		if (item.closest('dropdown-panel') !== _.panel) return;
		// a submenu opener is not a choice
		if (item.matches('dropdown-trigger')) return;

		if (
			item.disabled ||
			item.getAttribute('aria-disabled') === 'true'
		) {
			event.preventDefault();
			return;
		}

		_.#select(item);
	}

	/**
	 * Dispatches `dropdown-panel:select` and, unless it is canceled or the
	 * item is a checkbox/radio, closes the whole menu chain.
	 * @param {HTMLElement} item - the activated menu item
	 * @private
	 */
	#select(item) {
		const _ = this;
		const value =
			item.dataset.value ??
			item.getAttribute('value') ??
			item.getAttribute('href') ??
			null;

		const proceed = _.dispatchEvent(
			new CustomEvent('dropdown-panel:select', {
				bubbles: true,
				composed: true,
				cancelable: true,
				detail: { item, value },
			})
		);

		if (!proceed) return;

		// checkable items stay put: the menu is the place the consumer
		// keeps toggling things
		const role = item.getAttribute('role');
		if (role === 'menuitemcheckbox' || role === 'menuitemradio')
			return;

		// a choice in a submenu closes the whole chain, not just its level
		let root = _;
		let next = _.parentElement?.closest('dropdown-component[menu]');
		while (next) {
			root = next;
			next = next.parentElement?.closest('dropdown-component[menu]');
		}

		// a link takes focus with it when it navigates, so the chain closes
		// without restoring focus to the trigger
		const isLink = item.matches('a[href]');

		root.hide({ restoreFocus: !isLink });

		if (!isLink) root.trigger?.focus({ preventScroll: true });
	}

	/**
	 * Moves focus to the first item matching the accumulated typeahead
	 * buffer, searching forward from the current item and wrapping.
	 * @param {string} char - the character just typed
	 * @param {HTMLElement[]} items - the panel's items
	 * @param {number} currentIndex - index of the focused item, or -1
	 * @private
	 */
	#typeahead(char, items, currentIndex) {
		const _ = this;

		clearTimeout(_.#typeTimer);
		_.#typeBuffer += char.toLowerCase();
		_.#typeTimer = setTimeout(() => {
			_.#typeBuffer = '';
		}, TYPEAHEAD_TIMEOUT);

		let query = _.#typeBuffer;

		// the same character repeated cycles first letters instead of
		// looking for a literal run of it
		if (
			query.length > 1 &&
			!query.split('').some((c) => c !== query[0])
		) {
			query = query[0];
		}

		const count = items.length;
		// a single character steps to the NEXT match, so repeating it
		// cycles; a longer buffer re-searches from the item it already
		// landed on, so "s" then "sa" refines instead of skipping past
		const start =
			query.length > 1
				? Math.max(currentIndex, 0)
				: currentIndex === -1
					? 0
					: currentIndex + 1;

		for (let offset = 0; offset < count; offset++) {
			const index = (start + offset) % count;
			const text = (items[index].textContent || '')
				.trim()
				.toLowerCase();
			if (text.startsWith(query)) {
				_.#focusItem(index);
				return;
			}
		}
	}

	/**
	 * Drops a partially typed typeahead buffer.
	 * @private
	 */
	#clearTypeahead() {
		clearTimeout(this.#typeTimer);
		this.#typeTimer = null;
		this.#typeBuffer = '';
	}

	/**
	 * @returns {boolean} whether click/tap activation applies
	 * @private
	 */
	#clickEnabled() {
		if (this.triggerMode !== 'hover') return true;
		// hover-only would be unopenable on a device that cannot hover
		return !DropdownComponent.#supportsHover();
	}

	static #supportsHover() {
		return window.matchMedia
			? window.matchMedia(HOVER_QUERY).matches
			: true;
	}

	/**
	 * @returns {boolean} whether the panel opens sideways
	 * @private
	 */
	#opensRight() {
		return this.panel?.getAttribute('opens') === 'right';
	}

	/**
	 * True when the event target is a real control nested inside the
	 * trigger, whose own activation must not be hijacked.
	 * @param {EventTarget} target - the event target
	 * @returns {boolean}
	 * @private
	 */
	#isInteractiveDescendant(target) {
		const _ = this;

		if (target === _.trigger) return false;

		const interactive = target?.closest?.(FOCUSABLE_SELECTOR);
		return Boolean(
			interactive &&
			interactive !== _.trigger &&
			_.trigger.contains(interactive)
		);
	}

	/**
	 * Focusable descendants of this component's own panel, in dom order.
	 * Items belonging to a nested panel are excluded.
	 * @returns {HTMLElement[]}
	 * @private
	 */
	#focusableItems() {
		const _ = this;

		if (!_.panel) return [];

		const menu = _.#isMenu();
		const selector = menu ? MENU_ITEM_SELECTOR : FOCUSABLE_SELECTOR;

		return Array.from(_.panel.querySelectorAll(selector)).filter(
			(element) => {
				if (element.closest('dropdown-panel') !== _.panel) {
					return false;
				}
				if (!menu) return true;
				return (
					!element.disabled &&
					element.getAttribute('aria-disabled') !== 'true'
				);
			}
		);
	}

	/**
	 * Focuses a panel item by index. Negative and out-of-range indexes
	 * wrap around.
	 * @param {number} index - item index
	 * @private
	 */
	#focusItem(index) {
		const items = this.#focusableItems();
		if (!items.length) return;

		const count = items.length;
		const target = ((index % count) + count) % count;

		// roving tabindex follows focus, so the menu is one tab stop
		this.#syncMenuItems(target);
		items[target].focus({ preventScroll: true });
	}

	/**
	 * Keyboard handling bound to the trigger itself.
	 * @param {KeyboardEvent} event - the keydown event
	 * @private
	 */
	#handleTriggerKeydown(event) {
		const _ = this;

		// keydown bubbles: a real button or link inside the trigger keeps
		// its own activation
		if (event.target !== _.trigger) return;
		if (!_.#setup()) return;

		const key = event.key;

		if (key === 'Enter' || key === ' ') {
			event.preventDefault();
			event.stopPropagation();
			if (_.#visible) {
				_.hide();
			} else {
				_.#open('keyboard');
				// the menu-button pattern lands on the first item; a
				// disclosure leaves focus on the trigger
				if (_.#isMenu()) _.#focusItem(0);
			}
			return;
		}

		// while shown, the document handler owns navigation
		if (_.#visible) return;

		// inside a menu, up and down belong to the parent menu's item
		// list — a submenu opens on ArrowRight (or Enter/Space), never on
		// a vertical step through its own opener
		if (
			(key === 'ArrowDown' || key === 'ArrowUp') &&
			_.parentElement?.closest('dropdown-component[menu]')
		) {
			return;
		}

		if (
			key === 'ArrowDown' ||
			(key === 'ArrowRight' && _.#opensRight())
		) {
			event.preventDefault();
			event.stopPropagation();
			_.#open('keyboard');
			_.#focusItem(0);
			return;
		}

		if (key === 'ArrowUp') {
			event.preventDefault();
			event.stopPropagation();
			_.#open('keyboard');
			_.#focusItem(-1);
		}
	}

	/**
	 * Document-level keyboard handling, bound only while shown so that a
	 * hover-opened panel (which leaves focus on <body>) still answers to
	 * Escape.
	 * @param {KeyboardEvent} event - the keydown event
	 * @private
	 */
	#handleKeydown(event) {
		const _ = this;

		// progressive disclosure: the innermost shown dropdown owns the key
		if (_.querySelector('dropdown-component[visible]')) return;

		if (event.key === 'Escape') {
			const activeElement = document.activeElement;
			const shouldFocusTrigger =
				_.contains(activeElement) ||
				!activeElement ||
				activeElement === document.body;
			// captured before hide() clears it
			const returnTo = _.#returnTarget ?? _.trigger;

			event.preventDefault();
			_.hide();
			if (shouldFocusTrigger) {
				returnTo?.focus({ preventScroll: true });
			}
			return;
		}

		// the menu pattern parts company with disclosure here: Tab closes
		// the menu, and does not preventDefault, so focus moves on
		if (_.#isMenu() && event.key === 'Tab') {
			_.hide({ restoreFocus: false });
			return;
		}

		// navigation only applies when focus is already inside
		if (!_.contains(document.activeElement)) return;
		if (event.target?.closest?.(TEXT_ENTRY_SELECTOR)) return;

		const items = _.#focusableItems();
		const currentIndex = items.indexOf(document.activeElement);

		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault();
				_.#focusItem(currentIndex + 1);
				break;

			case 'ArrowUp':
				event.preventDefault();
				_.#focusItem((currentIndex === -1 ? 0 : currentIndex) - 1);
				break;

			case 'Home':
				event.preventDefault();
				_.#focusItem(0);
				break;

			case 'End':
				event.preventDefault();
				_.#focusItem(-1);
				break;

			case 'ArrowLeft': {
				if (!_.#opensRight()) break;
				const returnTo = _.#returnTarget ?? _.trigger;
				event.preventDefault();
				_.hide();
				returnTo?.focus({ preventScroll: true });
				break;
			}

			default:
				if (_.#isMenu())
					_.#handleMenuKeydown(event, items, currentIndex);
		}
	}

	/**
	 * The keys that only exist in menu mode: activation, submenu opening
	 * and typeahead.
	 * @param {KeyboardEvent} event - the keydown event
	 * @param {HTMLElement[]} items - the panel's items
	 * @param {number} currentIndex - index of the focused item, or -1
	 * @private
	 */
	#handleMenuKeydown(event, items, currentIndex) {
		const _ = this;
		const key = event.key;
		const item = currentIndex === -1 ? null : items[currentIndex];

		if (key === 'ArrowRight') {
			// a submenu trigger's own keydown handler owns Enter/Space, but
			// not this
			const nested = item?.matches('dropdown-trigger')
				? item.parentElement
				: null;
			if (!nested?.hasAttribute('menu')) return;
			event.preventDefault();
			nested.show();
			nested.focusItem(0);
			return;
		}

		if (key === 'Enter') {
			// real buttons and links activate natively; an authored
			// role="menuitem" has nothing to activate, so synthesize it
			if (!item || item.matches('button, a[href]')) return;
			event.preventDefault();
			item.click();
			return;
		}

		if (key === ' ') {
			if (!item) return;
			// a native button already clicks on Space, and preventing the
			// default here would cancel that activation
			if (item.matches('button')) return;
			// everything else: kill the page scroll and click it — a link
			// included, which Space alone would not follow
			event.preventDefault();
			item.click();
			return;
		}

		if (
			key.length === 1 &&
			!event.ctrlKey &&
			!event.metaKey &&
			!event.altKey
		) {
			event.preventDefault();
			_.#typeahead(key, items, currentIndex);
		}
	}
}

/**
 * Dropdown trigger component. Acts as the button that shows and hides
 * the panel; all interaction is wired up by <dropdown-component>.
 * @class DropdownTrigger
 * @extends HTMLElement
 */
class DropdownTrigger extends HTMLElement {
	/**
	 * when element is connected to the dom
	 */
	connectedCallback() {
		const _ = this;

		// ids come from one shared counter so they cannot collide with the
		// ones dropdown-component mints
		ensureId(_, 'dropdown-trigger');

		if (!_.hasAttribute('tabindex')) {
			_.setAttribute('tabindex', '0');
		}

		if (!_.hasAttribute('role')) {
			_.setAttribute('role', 'button');
		}
	}
}

/**
 * Dropdown panel component. Container for dropdown content.
 * @class DropdownPanel
 * @extends HTMLElement
 */
class DropdownPanel extends HTMLElement {
	/**
	 * when element is connected to the dom
	 *
	 * Sets the hidden state directly. <dropdown-component> takes over as
	 * soon as it resolves its children, but a panel that is parsed before
	 * that would otherwise be tabbable while invisible.
	 */
	connectedCallback() {
		if (this.getAttribute('aria-hidden') === 'false') return;

		this.setAttribute('aria-hidden', 'true');
		this.setAttribute('inert', '');
	}
}

// import components

// define custom elements if not already defined
if (!customElements.get('dropdown-component')) {
	customElements.define('dropdown-component', DropdownComponent);
}

if (!customElements.get('dropdown-trigger')) {
	customElements.define('dropdown-trigger', DropdownTrigger);
}

if (!customElements.get('dropdown-panel')) {
	customElements.define('dropdown-panel', DropdownPanel);
}

exports.DropdownComponent = DropdownComponent;
exports.DropdownPanel = DropdownPanel;
exports.DropdownTrigger = DropdownTrigger;
