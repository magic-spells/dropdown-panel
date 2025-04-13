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

var css_248z = "dropdown-component {\n  position: relative;\n  display: inline-block;\n}\ndropdown-component:focus {\n  background: green;\n}\n\ndropdown-component:hover::before,\ndropdown-trigger[aria-expanded=true]::before {\n  content: \"\";\n  background: transparent;\n  position: absolute;\n  left: 0px;\n  top: 80%;\n  width: 110%;\n  height: 30px;\n  transform-origin: top center;\n  transform: perspective(50px) rotateX(50deg);\n  z-index: 10;\n}\n\ndropdown-component:hover dropdown-panel,\ndropdown-panel[aria-hidden=false] {\n  opacity: 1;\n  transform: translateY(0) scale(1);\n  pointer-events: auto;\n  filter: blur(0px);\n  pointer-events: all;\n  visibility: visible;\n}\n\ndropdown-trigger {\n  display: inline-flex;\n  align-items: center;\n  cursor: pointer;\n  user-select: none;\n}\n\ndropdown-panel {\n  position: absolute;\n  top: 100%;\n  left: 0px;\n  z-index: 20;\n  min-width: 180px;\n  background-color: var(--panel-bg-color, #ffffff);\n  box-shadow: var(--panel-shadow, 0 2px 8px rgba(0, 0, 0, 0.15));\n  border-radius: var(--panel-border-radius, 4px);\n  padding: var(--panel-padding, 0.5rem 0);\n  margin-top: var(--panel-margin-top, 0.25rem);\n  opacity: 0;\n  filter: blur(4px);\n  transform: translateY(5px) scale(0.98);\n  pointer-events: none;\n  will-change: opacity, transform, filter;\n  transition: opacity var(--transition-duration, 200ms) var(--transition-timing, ease-out), transform var(--transition-duration, 200ms) var(--transition-timing, ease-out);\n  pointer-events: none;\n}\n\n.dropdown-item {\n  display: block;\n  padding: var(--item-padding, 0.5rem 1rem);\n  color: var(--item-color, inherit);\n  text-decoration: none;\n  cursor: pointer;\n  transition: background-color 0.2s ease;\n}\n.dropdown-item:hover, .dropdown-item:focus {\n  background-color: var(--item-hover-bg, #f8f9fa);\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRyb3Bkb3duLWNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0Usa0JBQWtCO0VBQ2xCLHFCQUFxQjtBQUN2QjtBQUNBO0VBQ0UsaUJBQWlCO0FBQ25COztBQUVBOztFQUVFLFdBQVc7RUFDWCx1QkFBdUI7RUFDdkIsa0JBQWtCO0VBQ2xCLFNBQVM7RUFDVCxRQUFRO0VBQ1IsV0FBVztFQUNYLFlBQVk7RUFDWiw0QkFBNEI7RUFDNUIsMkNBQTJDO0VBQzNDLFdBQVc7QUFDYjs7QUFFQTs7RUFFRSxVQUFVO0VBQ1YsaUNBQWlDO0VBQ2pDLG9CQUFvQjtFQUNwQixpQkFBaUI7RUFDakIsbUJBQW1CO0VBQ25CLG1CQUFtQjtBQUNyQjs7QUFFQTtFQUNFLG9CQUFvQjtFQUNwQixtQkFBbUI7RUFDbkIsZUFBZTtFQUNmLGlCQUFpQjtBQUNuQjs7QUFFQTtFQUNFLGtCQUFrQjtFQUNsQixTQUFTO0VBQ1QsU0FBUztFQUNULFdBQVc7RUFDWCxnQkFBZ0I7RUFDaEIsZ0RBQWdEO0VBQ2hELDhEQUE4RDtFQUM5RCw4Q0FBOEM7RUFDOUMsdUNBQXVDO0VBQ3ZDLDRDQUE0QztFQUM1QyxVQUFVO0VBQ1YsaUJBQWlCO0VBQ2pCLHNDQUFzQztFQUN0QyxvQkFBb0I7RUFDcEIsdUNBQXVDO0VBQ3ZDLHdLQUF3SztFQUN4SyxvQkFBb0I7QUFDdEI7O0FBRUE7RUFDRSxjQUFjO0VBQ2QseUNBQXlDO0VBQ3pDLGlDQUFpQztFQUNqQyxxQkFBcUI7RUFDckIsZUFBZTtFQUNmLHNDQUFzQztBQUN4QztBQUNBO0VBQ0UsK0NBQStDO0FBQ2pEIiwiZmlsZSI6ImRyb3Bkb3duLWNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiZHJvcGRvd24tY29tcG9uZW50IHtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG59XG5kcm9wZG93bi1jb21wb25lbnQ6Zm9jdXMge1xuICBiYWNrZ3JvdW5kOiBncmVlbjtcbn1cblxuZHJvcGRvd24tY29tcG9uZW50OmhvdmVyOjpiZWZvcmUsXG5kcm9wZG93bi10cmlnZ2VyW2FyaWEtZXhwYW5kZWQ9dHJ1ZV06OmJlZm9yZSB7XG4gIGNvbnRlbnQ6IFwiXCI7XG4gIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIGxlZnQ6IDBweDtcbiAgdG9wOiA4MCU7XG4gIHdpZHRoOiAxMTAlO1xuICBoZWlnaHQ6IDMwcHg7XG4gIHRyYW5zZm9ybS1vcmlnaW46IHRvcCBjZW50ZXI7XG4gIHRyYW5zZm9ybTogcGVyc3BlY3RpdmUoNTBweCkgcm90YXRlWCg1MGRlZyk7XG4gIHotaW5kZXg6IDEwO1xufVxuXG5kcm9wZG93bi1jb21wb25lbnQ6aG92ZXIgZHJvcGRvd24tcGFuZWwsXG5kcm9wZG93bi1wYW5lbFthcmlhLWhpZGRlbj1mYWxzZV0ge1xuICBvcGFjaXR5OiAxO1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCkgc2NhbGUoMSk7XG4gIHBvaW50ZXItZXZlbnRzOiBhdXRvO1xuICBmaWx0ZXI6IGJsdXIoMHB4KTtcbiAgcG9pbnRlci1ldmVudHM6IGFsbDtcbiAgdmlzaWJpbGl0eTogdmlzaWJsZTtcbn1cblxuZHJvcGRvd24tdHJpZ2dlciB7XG4gIGRpc3BsYXk6IGlubGluZS1mbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIHVzZXItc2VsZWN0OiBub25lO1xufVxuXG5kcm9wZG93bi1wYW5lbCB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiAxMDAlO1xuICBsZWZ0OiAwcHg7XG4gIHotaW5kZXg6IDIwO1xuICBtaW4td2lkdGg6IDE4MHB4O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1wYW5lbC1iZy1jb2xvciwgI2ZmZmZmZik7XG4gIGJveC1zaGFkb3c6IHZhcigtLXBhbmVsLXNoYWRvdywgMCAycHggOHB4IHJnYmEoMCwgMCwgMCwgMC4xNSkpO1xuICBib3JkZXItcmFkaXVzOiB2YXIoLS1wYW5lbC1ib3JkZXItcmFkaXVzLCA0cHgpO1xuICBwYWRkaW5nOiB2YXIoLS1wYW5lbC1wYWRkaW5nLCAwLjVyZW0gMCk7XG4gIG1hcmdpbi10b3A6IHZhcigtLXBhbmVsLW1hcmdpbi10b3AsIDAuMjVyZW0pO1xuICBvcGFjaXR5OiAwO1xuICBmaWx0ZXI6IGJsdXIoNHB4KTtcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDVweCkgc2NhbGUoMC45OCk7XG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xuICB3aWxsLWNoYW5nZTogb3BhY2l0eSwgdHJhbnNmb3JtLCBmaWx0ZXI7XG4gIHRyYW5zaXRpb246IG9wYWNpdHkgdmFyKC0tdHJhbnNpdGlvbi1kdXJhdGlvbiwgMjAwbXMpIHZhcigtLXRyYW5zaXRpb24tdGltaW5nLCBlYXNlLW91dCksIHRyYW5zZm9ybSB2YXIoLS10cmFuc2l0aW9uLWR1cmF0aW9uLCAyMDBtcykgdmFyKC0tdHJhbnNpdGlvbi10aW1pbmcsIGVhc2Utb3V0KTtcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG59XG5cbi5kcm9wZG93bi1pdGVtIHtcbiAgZGlzcGxheTogYmxvY2s7XG4gIHBhZGRpbmc6IHZhcigtLWl0ZW0tcGFkZGluZywgMC41cmVtIDFyZW0pO1xuICBjb2xvcjogdmFyKC0taXRlbS1jb2xvciwgaW5oZXJpdCk7XG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICB0cmFuc2l0aW9uOiBiYWNrZ3JvdW5kLWNvbG9yIDAuMnMgZWFzZTtcbn1cbi5kcm9wZG93bi1pdGVtOmhvdmVyLCAuZHJvcGRvd24taXRlbTpmb2N1cyB7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWl0ZW0taG92ZXItYmcsICNmOGY5ZmEpO1xufSJdfQ== */";
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
    _.setAttribute("tabindex", "-1");

    // get trigger and panel elements
    _.trigger = _.querySelector("dropdown-trigger");
    _.panel = _.querySelector("dropdown-panel");

    // validate existence
    if (!_.trigger || !_.panel) {
      console.warn(
        "dropdown-component requires <dropdown-trigger> and <dropdown-panel>",
      );
      return;
    }

    // assign unique id to panel if needed
    const panelId = _.panel.id || `dropdown-panel-${Date.now()}`;
    _.panel.id = panelId;

    // assign unique id to trigger if needed (for aria-labelledby)
    if (!_.trigger.id) {
      _.trigger.id = `dropdown-trigger-${Date.now()}`;
    }

    // initialize aria attributes
    _.trigger.setAttribute("aria-controls", panelId);
    _.trigger.setAttribute("aria-expanded", "false");
    _.panel.setAttribute("aria-hidden", "true");
    _.panel.setAttribute("role", "menu");
    _.panel.setAttribute("aria-labelledby", _.trigger.id);

    // helper methods
    _.open = () => {
      _.panel.setAttribute("aria-hidden", "false");
      _.panel.removeAttribute("inert");
      _.trigger.setAttribute("aria-expanded", "true");
    };

    _.close = () => {
      _.panel.setAttribute("aria-hidden", "true");
      _.panel.setAttribute("inert", "");
      _.trigger.setAttribute("aria-expanded", "false");
    };

    _.toggle = () => {
      if (_.panel.getAttribute("aria-hidden") === "true") {
        _.open();
      } else {
        _.close();
      }
    };

    // initial state
    _.close();

    // mouse enter and leave events on main dropdown-component element
    _.addEventListener("mouseenter", () => _.open());
    _.addEventListener("mouseleave", () => _.close());

    // open or close with enter
    _.trigger.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        _.toggle();
      }
      if (event.key === "Escape") {
        event.preventDefault();
        _.close();
        _.trigger.focus();
      }
    });

    // close panel when escape
    _.panel.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        _.close();
        _.trigger.focus();
      }
    });
  }
}

// define the element
if (!customElements.get("dropdown-component")) {
  customElements.define("dropdown-component", DropdownComponent);
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
 * @file Main entry point for dropdown-panel web component
 * @author Cory Schulz
 * @version 0.1.0
 */


// define custom elements if not already defined
if (!customElements.get("dropdown-component")) {
  customElements.define("dropdown-component", DropdownComponent);
}

if (!customElements.get("dropdown-trigger")) {
  customElements.define("dropdown-trigger", DropdownTrigger);
}

if (!customElements.get("dropdown-panel")) {
  customElements.define("dropdown-panel", DropdownPanel);
}

exports.DropdownComponent = DropdownComponent;
exports.DropdownPanel = DropdownPanel;
exports.DropdownTrigger = DropdownTrigger;
//# sourceMappingURL=dropdown-panel.cjs.js.map
