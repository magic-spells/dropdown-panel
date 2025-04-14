/**
 * dropdown menu component
 * container for mega menu style dropdown content
 * @class DropdownMenu
 * @extends HTMLElement
 */
export class DropdownMenu extends HTMLElement {
  constructor() {
    super();
  }

  /**
   * when element is connected to the dom
   */
  connectedCallback() {
    const _ = this;

    // ensure aria-hidden is set initially
    if (!_.hasAttribute('aria-hidden')) {
      _.setAttribute('aria-hidden', 'true');
    }

    // ensure role is menubar for mega menu
    if (!_.hasAttribute('role')) {
      _.setAttribute('role', 'menubar');
    }
  }
}

// define the element
if (!customElements.get('dropdown-menu')) {
  customElements.define('dropdown-menu', DropdownMenu);
}
