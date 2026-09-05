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
	static observedAttributes = ['visible', 'open-delay', 'close-delay'];

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
	 * @returns {'hover' | 'click' | 'both'}
	 */
	get triggerMode() {
		const mode = this.getAttribute('trigger');
		return mode === 'hover' || mode === 'click' ? mode : 'both';
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

		return Boolean(_.trigger && _.panel);
	}

	/**
	 * Wires up the aria relationships between trigger and panel.
	 */
	setupAria() {
		const _ = this;
		const panelId = ensureId(_.panel, 'dropdown-panel');
		const triggerId = ensureId(_.trigger, 'dropdown-trigger');

		_.trigger.setAttribute('aria-controls', panelId);
		_.trigger.setAttribute('aria-haspopup', 'true');

		// role="group" so the panel can carry an accessible name — a
		// role-less custom element cannot. Deliberately not a menu role.
		if (!_.panel.hasAttribute('role')) {
			_.panel.setAttribute('role', 'group');
		}
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

		_.addEventListener('pointerenter', _.handlers.pointerEnter);
		_.addEventListener('pointerleave', _.handlers.pointerLeave);
		_.trigger.addEventListener('click', _.handlers.triggerClick);
		_.trigger.addEventListener('keydown', _.handlers.triggerKeydown);
	}

	/**
	 * Unbinds every listener bound by attachListeners().
	 */
	detachListeners() {
		const _ = this;

		_.removeEventListener('pointerenter', _.handlers.pointerEnter);
		_.removeEventListener('pointerleave', _.handlers.pointerLeave);
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
		if (!_.#visible) return;
		_.#clearHoverTimer();
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
			_.trigger.focus({ preventScroll: true });
		}

		_.#visible = false;
		_.#openSource = null;
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
				'dropdown-component requires <dropdown-trigger> and <dropdown-panel> as direct children',
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
	 * @param {'hover' | 'click' | 'keyboard' | 'api'} source - what opened it
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
		if (_.#visible) return;
		// click, keyboard and api act now, cancelling any pending hover timer
		_.#clearHoverTimer();
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
		_.#attachDocumentListeners();
		DropdownComponent.#shown.add(_);

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
		document.addEventListener('pointerdown', _.handlers.endDismissal, {
			capture: true,
		});
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
		document.removeEventListener('pointerdown', _.handlers.endDismissal, {
			capture: true,
		});
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

		_.trigger.setAttribute(
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

		return Array.from(
			_.panel.querySelectorAll(FOCUSABLE_SELECTOR)
		).filter(
			(element) => element.closest('dropdown-panel') === _.panel
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
			if (_.#visible) _.hide();
			else _.#open('keyboard');
			return;
		}

		// while shown, the document handler owns navigation
		if (_.#visible) return;

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

			event.preventDefault();
			_.hide();
			if (shouldFocusTrigger) {
				_.trigger.focus({ preventScroll: true });
			}
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

			case 'ArrowLeft':
				if (!_.#opensRight()) break;
				event.preventDefault();
				_.hide();
				_.trigger.focus({ preventScroll: true });
				break;
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
