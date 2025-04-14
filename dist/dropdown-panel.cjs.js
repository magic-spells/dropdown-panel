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

var css_248z = ":root {\n  --dp-panel-bg-color: #ffffff;\n  --dp-panel-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);\n  --dp-panel-border-radius: 4px;\n  --dp-panel-padding: 0.5rem 0;\n  --dp-panel-margin-top: -5px;\n  --dp-menu-margin-top: 0px;\n  --dp-transition-duration: 200ms;\n  --dp-transition-timing: ease-out;\n  --dp-panel-z-index: 20;\n}\n\ndropdown-component {\n  display: inline-block;\n}\ndropdown-component:focus {\n  background: green;\n}\n\ndropdown-component:hover dropdown-trigger::before,\ndropdown-trigger[aria-expanded=true]::before {\n  content: \"\";\n  background: transparent;\n  position: absolute;\n  left: -10px;\n  top: 50%;\n  width: calc(100% + 20px);\n  height: 30px;\n  transform-origin: top center;\n  transform: perspective(50px) rotateX(50deg);\n  z-index: 10;\n}\n\ndropdown-trigger {\n  display: inline-flex;\n  align-items: center;\n  cursor: pointer;\n  user-select: none;\n  position: relative;\n}\n\ndropdown-panel,\ndropdown-menu {\n  position: absolute;\n  top: 100%;\n  left: 0px;\n  z-index: var(--dp-panel-z-index, 20);\n  background-color: var(--dp-panel-bg-color, #ffffff);\n  box-shadow: var(--dp-panel-shadow, 0 2px 8px rgba(0, 0, 0, 0.15));\n  padding: var(--dp-panel-padding, 0.5rem 0);\n  opacity: 0;\n  pointer-events: none;\n  overflow: hidden;\n  transition: opacity var(--dp-transition-duration, 200ms) var(--dp-transition-timing, ease-out);\n}\n\ndropdown-panel {\n  min-width: 180px;\n  filter: blur(4px);\n  transform: translateY(5px) scale(0.98);\n  border-radius: var(--dp-panel-border-radius, 4px);\n  margin-top: var(--dp-panel-margin-top, -5px);\n  will-change: opacity, transform, filter;\n  transition: opacity var(--dp-transition-duration, 200ms) var(--dp-transition-timing, ease-out), transform var(--dp-transition-duration, 200ms) var(--dp-transition-timing, ease-out);\n}\n\ndropdown-menu {\n  width: 100%;\n  margin-top: var(--dp-menu-margin-top, 0px);\n}\n\ndropdown-component:hover dropdown-panel,\ndropdown-panel[aria-hidden=false] {\n  opacity: 1;\n  transform: translateY(0) scale(1);\n  pointer-events: auto;\n  filter: blur(0px);\n  visibility: visible;\n}\n\ndropdown-component:hover dropdown-menu,\ndropdown-menu[aria-hidden=false] {\n  opacity: 1;\n  pointer-events: auto;\n  visibility: visible;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRyb3Bkb3duLWNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0UsNEJBQTRCO0VBQzVCLGdEQUFnRDtFQUNoRCw2QkFBNkI7RUFDN0IsNEJBQTRCO0VBQzVCLDJCQUEyQjtFQUMzQix5QkFBeUI7RUFDekIsK0JBQStCO0VBQy9CLGdDQUFnQztFQUNoQyxzQkFBc0I7QUFDeEI7O0FBRUE7RUFDRSxxQkFBcUI7QUFDdkI7QUFDQTtFQUNFLGlCQUFpQjtBQUNuQjs7QUFFQTs7RUFFRSxXQUFXO0VBQ1gsdUJBQXVCO0VBQ3ZCLGtCQUFrQjtFQUNsQixXQUFXO0VBQ1gsUUFBUTtFQUNSLHdCQUF3QjtFQUN4QixZQUFZO0VBQ1osNEJBQTRCO0VBQzVCLDJDQUEyQztFQUMzQyxXQUFXO0FBQ2I7O0FBRUE7RUFDRSxvQkFBb0I7RUFDcEIsbUJBQW1CO0VBQ25CLGVBQWU7RUFDZixpQkFBaUI7RUFDakIsa0JBQWtCO0FBQ3BCOztBQUVBOztFQUVFLGtCQUFrQjtFQUNsQixTQUFTO0VBQ1QsU0FBUztFQUNULG9DQUFvQztFQUNwQyxtREFBbUQ7RUFDbkQsaUVBQWlFO0VBQ2pFLDBDQUEwQztFQUMxQyxVQUFVO0VBQ1Ysb0JBQW9CO0VBQ3BCLGdCQUFnQjtFQUNoQiw4RkFBOEY7QUFDaEc7O0FBRUE7RUFDRSxnQkFBZ0I7RUFDaEIsaUJBQWlCO0VBQ2pCLHNDQUFzQztFQUN0QyxpREFBaUQ7RUFDakQsNENBQTRDO0VBQzVDLHVDQUF1QztFQUN2QyxvTEFBb0w7QUFDdEw7O0FBRUE7RUFDRSxXQUFXO0VBQ1gsMENBQTBDO0FBQzVDOztBQUVBOztFQUVFLFVBQVU7RUFDVixpQ0FBaUM7RUFDakMsb0JBQW9CO0VBQ3BCLGlCQUFpQjtFQUNqQixtQkFBbUI7QUFDckI7O0FBRUE7O0VBRUUsVUFBVTtFQUNWLG9CQUFvQjtFQUNwQixtQkFBbUI7QUFDckIiLCJmaWxlIjoiZHJvcGRvd24tY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyI6cm9vdCB7XG4gIC0tZHAtcGFuZWwtYmctY29sb3I6ICNmZmZmZmY7XG4gIC0tZHAtcGFuZWwtc2hhZG93OiAwIDJweCA4cHggcmdiYSgwLCAwLCAwLCAwLjE1KTtcbiAgLS1kcC1wYW5lbC1ib3JkZXItcmFkaXVzOiA0cHg7XG4gIC0tZHAtcGFuZWwtcGFkZGluZzogMC41cmVtIDA7XG4gIC0tZHAtcGFuZWwtbWFyZ2luLXRvcDogLTVweDtcbiAgLS1kcC1tZW51LW1hcmdpbi10b3A6IDBweDtcbiAgLS1kcC10cmFuc2l0aW9uLWR1cmF0aW9uOiAyMDBtcztcbiAgLS1kcC10cmFuc2l0aW9uLXRpbWluZzogZWFzZS1vdXQ7XG4gIC0tZHAtcGFuZWwtei1pbmRleDogMjA7XG59XG5cbmRyb3Bkb3duLWNvbXBvbmVudCB7XG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbn1cbmRyb3Bkb3duLWNvbXBvbmVudDpmb2N1cyB7XG4gIGJhY2tncm91bmQ6IGdyZWVuO1xufVxuXG5kcm9wZG93bi1jb21wb25lbnQ6aG92ZXIgZHJvcGRvd24tdHJpZ2dlcjo6YmVmb3JlLFxuZHJvcGRvd24tdHJpZ2dlclthcmlhLWV4cGFuZGVkPXRydWVdOjpiZWZvcmUge1xuICBjb250ZW50OiBcIlwiO1xuICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICBsZWZ0OiAtMTBweDtcbiAgdG9wOiA1MCU7XG4gIHdpZHRoOiBjYWxjKDEwMCUgKyAyMHB4KTtcbiAgaGVpZ2h0OiAzMHB4O1xuICB0cmFuc2Zvcm0tb3JpZ2luOiB0b3AgY2VudGVyO1xuICB0cmFuc2Zvcm06IHBlcnNwZWN0aXZlKDUwcHgpIHJvdGF0ZVgoNTBkZWcpO1xuICB6LWluZGV4OiAxMDtcbn1cblxuZHJvcGRvd24tdHJpZ2dlciB7XG4gIGRpc3BsYXk6IGlubGluZS1mbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIHVzZXItc2VsZWN0OiBub25lO1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG59XG5cbmRyb3Bkb3duLXBhbmVsLFxuZHJvcGRvd24tbWVudSB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiAxMDAlO1xuICBsZWZ0OiAwcHg7XG4gIHotaW5kZXg6IHZhcigtLWRwLXBhbmVsLXotaW5kZXgsIDIwKTtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZHAtcGFuZWwtYmctY29sb3IsICNmZmZmZmYpO1xuICBib3gtc2hhZG93OiB2YXIoLS1kcC1wYW5lbC1zaGFkb3csIDAgMnB4IDhweCByZ2JhKDAsIDAsIDAsIDAuMTUpKTtcbiAgcGFkZGluZzogdmFyKC0tZHAtcGFuZWwtcGFkZGluZywgMC41cmVtIDApO1xuICBvcGFjaXR5OiAwO1xuICBwb2ludGVyLWV2ZW50czogbm9uZTtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgdHJhbnNpdGlvbjogb3BhY2l0eSB2YXIoLS1kcC10cmFuc2l0aW9uLWR1cmF0aW9uLCAyMDBtcykgdmFyKC0tZHAtdHJhbnNpdGlvbi10aW1pbmcsIGVhc2Utb3V0KTtcbn1cblxuZHJvcGRvd24tcGFuZWwge1xuICBtaW4td2lkdGg6IDE4MHB4O1xuICBmaWx0ZXI6IGJsdXIoNHB4KTtcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDVweCkgc2NhbGUoMC45OCk7XG4gIGJvcmRlci1yYWRpdXM6IHZhcigtLWRwLXBhbmVsLWJvcmRlci1yYWRpdXMsIDRweCk7XG4gIG1hcmdpbi10b3A6IHZhcigtLWRwLXBhbmVsLW1hcmdpbi10b3AsIC01cHgpO1xuICB3aWxsLWNoYW5nZTogb3BhY2l0eSwgdHJhbnNmb3JtLCBmaWx0ZXI7XG4gIHRyYW5zaXRpb246IG9wYWNpdHkgdmFyKC0tZHAtdHJhbnNpdGlvbi1kdXJhdGlvbiwgMjAwbXMpIHZhcigtLWRwLXRyYW5zaXRpb24tdGltaW5nLCBlYXNlLW91dCksIHRyYW5zZm9ybSB2YXIoLS1kcC10cmFuc2l0aW9uLWR1cmF0aW9uLCAyMDBtcykgdmFyKC0tZHAtdHJhbnNpdGlvbi10aW1pbmcsIGVhc2Utb3V0KTtcbn1cblxuZHJvcGRvd24tbWVudSB7XG4gIHdpZHRoOiAxMDAlO1xuICBtYXJnaW4tdG9wOiB2YXIoLS1kcC1tZW51LW1hcmdpbi10b3AsIDBweCk7XG59XG5cbmRyb3Bkb3duLWNvbXBvbmVudDpob3ZlciBkcm9wZG93bi1wYW5lbCxcbmRyb3Bkb3duLXBhbmVsW2FyaWEtaGlkZGVuPWZhbHNlXSB7XG4gIG9wYWNpdHk6IDE7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKSBzY2FsZSgxKTtcbiAgcG9pbnRlci1ldmVudHM6IGF1dG87XG4gIGZpbHRlcjogYmx1cigwcHgpO1xuICB2aXNpYmlsaXR5OiB2aXNpYmxlO1xufVxuXG5kcm9wZG93bi1jb21wb25lbnQ6aG92ZXIgZHJvcGRvd24tbWVudSxcbmRyb3Bkb3duLW1lbnVbYXJpYS1oaWRkZW49ZmFsc2VdIHtcbiAgb3BhY2l0eTogMTtcbiAgcG9pbnRlci1ldmVudHM6IGF1dG87XG4gIHZpc2liaWxpdHk6IHZpc2libGU7XG59Il19 */";
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
