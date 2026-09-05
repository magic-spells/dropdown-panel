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

export type DropdownTriggerMode = 'hover' | 'click' | 'both';

export type DropdownArrowBehavior = 'flip' | 'static' | 'none';

export type DropdownArrowShape = 'chevron' | 'triangle';

export interface DropdownComponentEventMap {
	/** Cancelable. Preventing it aborts the show. */
	'dropdown-panel:before-show': CustomEvent<DropdownPanelEventDetail>;
	'dropdown-panel:show': CustomEvent<DropdownPanelEventDetail>;
	/** Cancelable. Preventing it aborts the hide. */
	'dropdown-panel:before-hide': CustomEvent<DropdownPanelEventDetail>;
	'dropdown-panel:hide': CustomEvent<DropdownPanelEventDetail>;
}

/**
 * Dropdown container.
 *
 * **Attributes**
 * - `visible` — boolean, reflected. The source of truth for shown state.
 * - `trigger` — `hover` | `click` | `both` (default `both`).
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
