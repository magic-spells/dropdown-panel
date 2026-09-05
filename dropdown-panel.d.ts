export interface DropdownPanelEventDetail {
	/** The <dropdown-trigger> element for this dropdown. */
	trigger: HTMLElement;
	/** The <dropdown-panel> element for this dropdown. */
	panel: HTMLElement;
}

export interface DropdownHideOptions {
	/**
	 * Return focus to the trigger when focus is currently inside the
	 * component. Defaults to `true`.
	 */
	restoreFocus?: boolean;
}

export type DropdownTriggerMode =
	| 'hover'
	| 'click'
	| 'both'
	| 'contextmenu';

export interface DropdownSelectEventDetail {
	/** The activated menu item. */
	item: HTMLElement;
	/**
	 * `data-value`, then the `value` attribute, then `href` — whichever the
	 * item carries first. `null` when it carries none of them.
	 */
	value: string | null;
}

export type DropdownArrowBehavior = 'flip' | 'static' | 'none';

export type DropdownArrowShape = 'chevron' | 'triangle';

export interface DropdownComponentEventMap {
	/** Cancelable. Preventing it aborts the show. */
	'dropdown-panel:before-show': CustomEvent<DropdownPanelEventDetail>;
	'dropdown-panel:show': CustomEvent<DropdownPanelEventDetail>;
	/** Cancelable. Preventing it aborts the hide. */
	'dropdown-panel:before-hide': CustomEvent<DropdownPanelEventDetail>;
	'dropdown-panel:hide': CustomEvent<DropdownPanelEventDetail>;
	/**
	 * `menu` mode only. Cancelable — preventing it leaves the menu chain
	 * open, which is how a checkbox menu stays up.
	 */
	'dropdown-panel:select': CustomEvent<DropdownSelectEventDetail>;
}

/**
 * Dropdown container.
 *
 * **Attributes**
 * - `visible` — boolean, reflected. The source of truth for shown state.
 * - `menu` — boolean, opt-in. Application-menu semantics: `role="menu"` on
 *   the panel, `role="menuitem"` on its items, a roving `tabindex`,
 *   typeahead, `Enter`/`Space` activation, `Tab` to close, and
 *   `dropdown-panel:select` on every activation. Read once, at setup.
 * - `trigger` — `hover` | `click` | `both` | `contextmenu` (default `both`).
 *   `contextmenu` opens the panel at the pointer on right-click or a 500 ms
 *   touch long-press, and needs no `<dropdown-trigger>`.
 * - `open-delay` — milliseconds `pointerenter` waits before opening (default
 *   `0`). Hover only; leaving before it fires cancels the open.
 * - `close-delay` — milliseconds `pointerleave` waits before closing a
 *   hover-opened panel (default `0`). Re-entering cancels the close. Click-,
 *   keyboard- and api-opened panels latch, so it never applies to them.
 * - `arrow` — `flip` | `static` | `none` (default `flip`). Behaviour of the
 *   `[data-dropdown-arrow]` element inside the trigger. Requires
 *   `@magic-spells/dropdown-panel/css/effects`.
 * - `arrow-shape` — `chevron` | `triangle` (default `chevron`). The glyph the
 *   stylesheet draws, and only when the hook element is empty. Requires
 *   `@magic-spells/dropdown-panel/css/effects`.
 *
 * The arrow hook must be a real child element — never a pseudo-element on
 * `<dropdown-trigger>`, whose `::before` is the hover bridge — and should
 * carry `aria-hidden="true"`.
 */
export class DropdownComponent extends HTMLElement {
	/** Bound event handler references, kept for cleanup. */
	handlers: Record<string, EventListener>;

	/** The direct child <dropdown-trigger>, once resolved. */
	trigger: HTMLElement | null;

	/** The direct child <dropdown-panel>, once resolved. */
	panel: HTMLElement | null;

	/** Reflects the `visible` attribute. */
	visible: boolean;

	/** Resolved value of the `trigger` attribute. */
	readonly triggerMode: DropdownTriggerMode;

	/** Resolved value of the `open-delay` attribute, in milliseconds. */
	readonly openDelay: number;

	/** Resolved value of the `close-delay` attribute, in milliseconds. */
	readonly closeDelay: number;

	/** Shows the panel. Idempotent and safe on an incomplete element. */
	show(): void;

	/** Hides the panel. Idempotent and safe on an incomplete element. */
	hide(options?: DropdownHideOptions): void;

	/** Shows the panel when hidden, hides it when shown. */
	toggle(): void;

	/**
	 * Shows the panel pinned to a point in viewport coordinates, flipped
	 * and clamped so it stays on screen. What `trigger="contextmenu"` calls,
	 * and callable directly for a custom right-click surface.
	 */
	showAt(x: number, y: number): void;

	/**
	 * Focuses a panel item by index. Negative and out-of-range indexes wrap.
	 */
	focusItem(index: number): void;

	queryDOM(): boolean;
	setupAria(): void;
	attachListeners(): void;
	detachListeners(): void;

	addEventListener<K extends keyof DropdownComponentEventMap>(
		type: K,
		listener: (event: DropdownComponentEventMap[K]) => void,
		options?: boolean | AddEventListenerOptions
	): void;
	addEventListener(
		type: string,
		listener: EventListenerOrEventListenerObject,
		options?: boolean | AddEventListenerOptions
	): void;

	removeEventListener<K extends keyof DropdownComponentEventMap>(
		type: K,
		listener: (event: DropdownComponentEventMap[K]) => void,
		options?: boolean | EventListenerOptions
	): void;
	removeEventListener(
		type: string,
		listener: EventListenerOrEventListenerObject,
		options?: boolean | EventListenerOptions
	): void;
}

/** Button element that shows and hides the panel. */
export class DropdownTrigger extends HTMLElement {}

/**
 * Panel content container.
 *
 * **Attributes**
 * - `wide` — boolean. Full-width mega menu layout.
 * - `opens` — `down` | `right` (default `down`).
 * - `align` — `start` | `end` (default `start`). Which edge of a downward
 *   panel lines up with the trigger. Pure CSS; `opens="right"` ignores it.
 * - `flip` — boolean, opt-in. Opens the panel upward when it would run past
 *   the bottom of the viewport and there is room above. Measured once per
 *   open; sets the `flipped` attribute, which the core stylesheet styles.
 * - `effect` — `fade` | `slide` | `scale` | `blur` | `swing`. Requires
 *   `@magic-spells/dropdown-panel/css/effects`.
 */
export class DropdownPanel extends HTMLElement {}

declare global {
	interface HTMLElementTagNameMap {
		'dropdown-component': DropdownComponent;
		'dropdown-trigger': DropdownTrigger;
		'dropdown-panel': DropdownPanel;
	}
}
