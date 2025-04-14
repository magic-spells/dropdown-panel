'use strict';

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = ":root {\n  --dp-panel-bg-color: #ffffff;\n  --dp-panel-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);\n  --dp-panel-border-radius: 4px;\n  --dp-panel-padding: 0.5rem 0;\n  --dp-panel-margin-top: -5px;\n  --dp-menu-margin-top: 0px;\n  --dp-transition-duration: 200ms;\n  --dp-transition-timing: ease-out;\n  --dp-panel-z-index: 20;\n}\n\ndropdown-component {\n  display: inline-block;\n}\ndropdown-component:focus {\n  background: green;\n}\n\ndropdown-component:hover dropdown-trigger::before,\ndropdown-trigger[aria-expanded=true]::before {\n  content: \"\";\n  background: transparent;\n  position: absolute;\n  left: -10px;\n  top: 50%;\n  width: calc(100% + 20px);\n  height: 30px;\n  transform-origin: top center;\n  transform: perspective(50px) rotateX(50deg);\n  z-index: 10;\n}\n\ndropdown-trigger {\n  display: inline-flex;\n  align-items: center;\n  cursor: pointer;\n  user-select: none;\n  position: relative;\n}\n\ndropdown-panel,\ndropdown-menu {\n  position: absolute;\n  top: 100%;\n  left: 0px;\n  z-index: var(--dp-panel-z-index, 20);\n  background-color: var(--dp-panel-bg-color, #ffffff);\n  box-shadow: var(--dp-panel-shadow, 0 2px 8px rgba(0, 0, 0, 0.15));\n  padding: var(--dp-panel-padding, 0.5rem 0);\n  opacity: 0;\n  pointer-events: none;\n  overflow: hidden;\n  transition: opacity var(--dp-transition-duration, 200ms) var(--dp-transition-timing, ease-out);\n}\n\ndropdown-panel {\n  min-width: 180px;\n  filter: blur(4px);\n  transform: translateY(5px) scale(0.98);\n  border-radius: var(--dp-panel-border-radius, 4px);\n  margin-top: var(--dp-panel-margin-top, -5px);\n  will-change: opacity, transform, filter;\n  transition: opacity var(--dp-transition-duration, 200ms) var(--dp-transition-timing, ease-out), transform var(--dp-transition-duration, 200ms) var(--dp-transition-timing, ease-out);\n}\n\ndropdown-menu {\n  width: 100%;\n  background: red;\n  margin-top: var(--dp-menu-margin-top, 0px);\n}\n\ndropdown-component:hover dropdown-panel,\ndropdown-panel[aria-hidden=false] {\n  opacity: 1;\n  transform: translateY(0) scale(1);\n  pointer-events: auto;\n  filter: blur(0px);\n  visibility: visible;\n}\n\ndropdown-component:hover dropdown-menu,\ndropdown-menu[aria-hidden=false] {\n  opacity: 1;\n  pointer-events: auto;\n  visibility: visible;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRyb3Bkb3duLWNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0UsNEJBQTRCO0VBQzVCLGdEQUFnRDtFQUNoRCw2QkFBNkI7RUFDN0IsNEJBQTRCO0VBQzVCLDJCQUEyQjtFQUMzQix5QkFBeUI7RUFDekIsK0JBQStCO0VBQy9CLGdDQUFnQztFQUNoQyxzQkFBc0I7QUFDeEI7O0FBRUE7RUFDRSxxQkFBcUI7QUFDdkI7QUFDQTtFQUNFLGlCQUFpQjtBQUNuQjs7QUFFQTs7RUFFRSxXQUFXO0VBQ1gsdUJBQXVCO0VBQ3ZCLGtCQUFrQjtFQUNsQixXQUFXO0VBQ1gsUUFBUTtFQUNSLHdCQUF3QjtFQUN4QixZQUFZO0VBQ1osNEJBQTRCO0VBQzVCLDJDQUEyQztFQUMzQyxXQUFXO0FBQ2I7O0FBRUE7RUFDRSxvQkFBb0I7RUFDcEIsbUJBQW1CO0VBQ25CLGVBQWU7RUFDZixpQkFBaUI7RUFDakIsa0JBQWtCO0FBQ3BCOztBQUVBOztFQUVFLGtCQUFrQjtFQUNsQixTQUFTO0VBQ1QsU0FBUztFQUNULG9DQUFvQztFQUNwQyxtREFBbUQ7RUFDbkQsaUVBQWlFO0VBQ2pFLDBDQUEwQztFQUMxQyxVQUFVO0VBQ1Ysb0JBQW9CO0VBQ3BCLGdCQUFnQjtFQUNoQiw4RkFBOEY7QUFDaEc7O0FBRUE7RUFDRSxnQkFBZ0I7RUFDaEIsaUJBQWlCO0VBQ2pCLHNDQUFzQztFQUN0QyxpREFBaUQ7RUFDakQsNENBQTRDO0VBQzVDLHVDQUF1QztFQUN2QyxvTEFBb0w7QUFDdEw7O0FBRUE7RUFDRSxXQUFXO0VBQ1gsZUFBZTtFQUNmLDBDQUEwQztBQUM1Qzs7QUFFQTs7RUFFRSxVQUFVO0VBQ1YsaUNBQWlDO0VBQ2pDLG9CQUFvQjtFQUNwQixpQkFBaUI7RUFDakIsbUJBQW1CO0FBQ3JCOztBQUVBOztFQUVFLFVBQVU7RUFDVixvQkFBb0I7RUFDcEIsbUJBQW1CO0FBQ3JCIiwiZmlsZSI6ImRyb3Bkb3duLWNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiOnJvb3Qge1xuICAtLWRwLXBhbmVsLWJnLWNvbG9yOiAjZmZmZmZmO1xuICAtLWRwLXBhbmVsLXNoYWRvdzogMCAycHggOHB4IHJnYmEoMCwgMCwgMCwgMC4xNSk7XG4gIC0tZHAtcGFuZWwtYm9yZGVyLXJhZGl1czogNHB4O1xuICAtLWRwLXBhbmVsLXBhZGRpbmc6IDAuNXJlbSAwO1xuICAtLWRwLXBhbmVsLW1hcmdpbi10b3A6IC01cHg7XG4gIC0tZHAtbWVudS1tYXJnaW4tdG9wOiAwcHg7XG4gIC0tZHAtdHJhbnNpdGlvbi1kdXJhdGlvbjogMjAwbXM7XG4gIC0tZHAtdHJhbnNpdGlvbi10aW1pbmc6IGVhc2Utb3V0O1xuICAtLWRwLXBhbmVsLXotaW5kZXg6IDIwO1xufVxuXG5kcm9wZG93bi1jb21wb25lbnQge1xuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG59XG5kcm9wZG93bi1jb21wb25lbnQ6Zm9jdXMge1xuICBiYWNrZ3JvdW5kOiBncmVlbjtcbn1cblxuZHJvcGRvd24tY29tcG9uZW50OmhvdmVyIGRyb3Bkb3duLXRyaWdnZXI6OmJlZm9yZSxcbmRyb3Bkb3duLXRyaWdnZXJbYXJpYS1leHBhbmRlZD10cnVlXTo6YmVmb3JlIHtcbiAgY29udGVudDogXCJcIjtcbiAgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgbGVmdDogLTEwcHg7XG4gIHRvcDogNTAlO1xuICB3aWR0aDogY2FsYygxMDAlICsgMjBweCk7XG4gIGhlaWdodDogMzBweDtcbiAgdHJhbnNmb3JtLW9yaWdpbjogdG9wIGNlbnRlcjtcbiAgdHJhbnNmb3JtOiBwZXJzcGVjdGl2ZSg1MHB4KSByb3RhdGVYKDUwZGVnKTtcbiAgei1pbmRleDogMTA7XG59XG5cbmRyb3Bkb3duLXRyaWdnZXIge1xuICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICB1c2VyLXNlbGVjdDogbm9uZTtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xufVxuXG5kcm9wZG93bi1wYW5lbCxcbmRyb3Bkb3duLW1lbnUge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogMTAwJTtcbiAgbGVmdDogMHB4O1xuICB6LWluZGV4OiB2YXIoLS1kcC1wYW5lbC16LWluZGV4LCAyMCk7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWRwLXBhbmVsLWJnLWNvbG9yLCAjZmZmZmZmKTtcbiAgYm94LXNoYWRvdzogdmFyKC0tZHAtcGFuZWwtc2hhZG93LCAwIDJweCA4cHggcmdiYSgwLCAwLCAwLCAwLjE1KSk7XG4gIHBhZGRpbmc6IHZhcigtLWRwLXBhbmVsLXBhZGRpbmcsIDAuNXJlbSAwKTtcbiAgb3BhY2l0eTogMDtcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gIG92ZXJmbG93OiBoaWRkZW47XG4gIHRyYW5zaXRpb246IG9wYWNpdHkgdmFyKC0tZHAtdHJhbnNpdGlvbi1kdXJhdGlvbiwgMjAwbXMpIHZhcigtLWRwLXRyYW5zaXRpb24tdGltaW5nLCBlYXNlLW91dCk7XG59XG5cbmRyb3Bkb3duLXBhbmVsIHtcbiAgbWluLXdpZHRoOiAxODBweDtcbiAgZmlsdGVyOiBibHVyKDRweCk7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWSg1cHgpIHNjYWxlKDAuOTgpO1xuICBib3JkZXItcmFkaXVzOiB2YXIoLS1kcC1wYW5lbC1ib3JkZXItcmFkaXVzLCA0cHgpO1xuICBtYXJnaW4tdG9wOiB2YXIoLS1kcC1wYW5lbC1tYXJnaW4tdG9wLCAtNXB4KTtcbiAgd2lsbC1jaGFuZ2U6IG9wYWNpdHksIHRyYW5zZm9ybSwgZmlsdGVyO1xuICB0cmFuc2l0aW9uOiBvcGFjaXR5IHZhcigtLWRwLXRyYW5zaXRpb24tZHVyYXRpb24sIDIwMG1zKSB2YXIoLS1kcC10cmFuc2l0aW9uLXRpbWluZywgZWFzZS1vdXQpLCB0cmFuc2Zvcm0gdmFyKC0tZHAtdHJhbnNpdGlvbi1kdXJhdGlvbiwgMjAwbXMpIHZhcigtLWRwLXRyYW5zaXRpb24tdGltaW5nLCBlYXNlLW91dCk7XG59XG5cbmRyb3Bkb3duLW1lbnUge1xuICB3aWR0aDogMTAwJTtcbiAgYmFja2dyb3VuZDogcmVkO1xuICBtYXJnaW4tdG9wOiB2YXIoLS1kcC1tZW51LW1hcmdpbi10b3AsIDBweCk7XG59XG5cbmRyb3Bkb3duLWNvbXBvbmVudDpob3ZlciBkcm9wZG93bi1wYW5lbCxcbmRyb3Bkb3duLXBhbmVsW2FyaWEtaGlkZGVuPWZhbHNlXSB7XG4gIG9wYWNpdHk6IDE7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKSBzY2FsZSgxKTtcbiAgcG9pbnRlci1ldmVudHM6IGF1dG87XG4gIGZpbHRlcjogYmx1cigwcHgpO1xuICB2aXNpYmlsaXR5OiB2aXNpYmxlO1xufVxuXG5kcm9wZG93bi1jb21wb25lbnQ6aG92ZXIgZHJvcGRvd24tbWVudSxcbmRyb3Bkb3duLW1lbnVbYXJpYS1oaWRkZW49ZmFsc2VdIHtcbiAgb3BhY2l0eTogMTtcbiAgcG9pbnRlci1ldmVudHM6IGF1dG87XG4gIHZpc2liaWxpdHk6IHZpc2libGU7XG59Il19 */";
styleInject(css_248z);

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

exports.DropdownComponent = DropdownComponent;
exports.DropdownPanel = DropdownPanel;
exports.DropdownTrigger = DropdownTrigger;
//# sourceMappingURL=dropdown-panel.cjs.js.map
