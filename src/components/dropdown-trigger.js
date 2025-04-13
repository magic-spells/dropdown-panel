/**
 * Dropdown trigger component
 * Manages user interactions for opening and closing the dropdown
 * @class DropdownTrigger
 * @extends HTMLElement
 */
export class DropdownTrigger extends HTMLElement {
  constructor() {
    super();
  }

  /**
   * when element is connected to the dom
   */
  connectedCallback() {
    const _ = this;
    
    // ensure trigger has an ID for ARIA relationships
    if (!_.id) {
      _.id = `dropdown-trigger-${Date.now()}`;
    }

    // ensure trigger is focusable
    if (!_.hasAttribute('tabindex')) {
      _.setAttribute('tabindex', '0');
    }

    // set role for accessibility
    if (!_.hasAttribute('role')) {
      _.setAttribute('role', 'button');
    }

    // prevent text selection on trigger
    _.style.userSelect = 'none';
  }
}