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
