import { ensureId } from '../uid.js';

/**
 * Dropdown trigger component. Acts as the button that shows and hides
 * the panel; all interaction is wired up by <dropdown-component>.
 * @class DropdownTrigger
 * @extends HTMLElement
 */
export class DropdownTrigger extends HTMLElement {
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
