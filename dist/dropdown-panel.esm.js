/**
 * main dropdown component
 * manages interactions between <dropdown-trigger> and <dropdown-panel>
 * @class DropdownComponent
 * @extends HTMLElement
 */
class DropdownComponent extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const _ = this;

    // make component focusable for keyboard navigation
    _.setAttribute('tabindex', '-1');

    // get trigger element - use > to select only direct children
    _.trigger = _.querySelector(':scope > dropdown-trigger');

    // get content element (either panel or menu) - use > to select only direct children
    _.panel =
      _.querySelector(':scope > dropdown-panel') ||
      _.querySelector(':scope > dropdown-menu');

    // validate existence
    if (!_.trigger || !_.panel) {
      console.warn(
        'dropdown-component requires <dropdown-trigger> and either <dropdown-panel> or <dropdown-menu> as direct children'
      );
      return;
    }

    // if it's a dropdown-panel, set position relative on the dropdown component
    if (_.panel.tagName.toLowerCase() === 'dropdown-panel') {
      _.style.position = 'relative';
    } else {
      _.style.position = 'static';
    }

    // assign unique id to panel if needed
    const panelId = _.panel.id || `dropdown-panel-${Date.now()}`;
    _.panel.id = panelId;

    // assign unique id to trigger if needed (for aria-labelledby)
    if (!_.trigger.id) {
      _.trigger.id = `dropdown-trigger-${Date.now()}`;
    }

    // initialize aria attributes
    _.trigger.setAttribute('aria-controls', panelId);
    _.trigger.setAttribute('aria-expanded', 'false');
    _.panel.setAttribute('aria-hidden', 'true');
    _.panel.setAttribute('role', 'menu');
    _.panel.setAttribute('aria-labelledby', _.trigger.id);

    // initial state
    _.hide();

    // mouse enter and leave events on main dropdown-component element
    _.addEventListener('mouseenter', () => _.show());
    _.addEventListener('mouseleave', () => _.hide());

    // show or hide with enter
    _.trigger.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        _.toggle();
      }
      if (event.key === 'Escape') {
        event.preventDefault();
        _.hide();
        _.trigger.focus();
      }
    });

    // hide panel when escape
    _.panel.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        _.hide();
        _.trigger.focus();
      }
    });
  }

  toggle() {
    const _ = this;
    if (_.panel.getAttribute('aria-hidden') === 'true') {
      _.show();
    } else {
      _.hide();
    }
  }

  show() {
    const _ = this;
    _.panel.setAttribute('aria-hidden', 'false');
    _.panel.removeAttribute('inert');
    _.trigger.setAttribute('aria-expanded', 'true');
  }

  hide() {
    const _ = this;
    _.panel.setAttribute('aria-hidden', 'true');
    _.panel.setAttribute('inert', '');
    _.trigger.setAttribute('aria-expanded', 'false');
  }
}

// define the element
if (!customElements.get('dropdown-component')) {
  customElements.define('dropdown-component', DropdownComponent);
}

/**
 * Dropdown trigger component
 * Manages user interactions for opening and closing the dropdown
 * @class DropdownTrigger
 * @extends HTMLElement
 */
class DropdownTrigger extends HTMLElement {
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

/**
 * Dropdown panel component
 * Container for dropdown content
 * @class DropdownPanel
 * @extends HTMLElement
 */
class DropdownPanel extends HTMLElement {
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

/**
 * dropdown menu component
 * container for mega menu style dropdown content
 * @class DropdownMenu
 * @extends HTMLElement
 */
class DropdownMenu extends HTMLElement {
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

/**
 * @file Main entry point for dropdown-panel web component
 * @author Cory Schulz
 * @version 0.1.0
 */


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

if (!customElements.get('dropdown-menu')) {
  customElements.define('dropdown-menu', DropdownMenu);
}

export { DropdownComponent, DropdownPanel, DropdownTrigger };
