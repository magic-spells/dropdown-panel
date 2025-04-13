/**
 * Dropdown panel component
 * Container for dropdown content
 * @class DropdownPanel
 * @extends HTMLElement
 */
export class DropdownPanel extends HTMLElement {
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
    
    // ensure role is menu by default
    if (!_.hasAttribute('role')) {
      _.setAttribute('role', 'menu');
    }
  }
}