/**
 * Dropdown panel component. Container for dropdown content.
 * @class DropdownPanel
 * @extends HTMLElement
 */
export class DropdownPanel extends HTMLElement {
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
