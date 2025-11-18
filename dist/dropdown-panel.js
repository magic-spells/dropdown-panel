(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.DropdownPanel = {}));
})(this, (function (exports) { 'use strict';

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

  var css_248z = ":root {\n  --dp-panel-bg-color: #ffffff;\n  --dp-panel-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);\n  --dp-panel-border-radius: 4px;\n  --dp-panel-padding: 0.5rem 0;\n  --dp-panel-margin-top: -5px;\n  --dp-menu-margin-top: 0px;\n  --dp-transition-duration: 200ms;\n  --dp-transition-timing: ease-out;\n  --dp-panel-z-index: 20;\n}\n\ndropdown-component {\n  display: inline-block;\n}\ndropdown-component:focus {\n  background: green;\n}\n\ndropdown-component:hover > dropdown-trigger::before,\ndropdown-trigger[aria-expanded=true]::before {\n  content: \"\";\n  background: transparent;\n  position: absolute;\n  left: -10px;\n  top: 50%;\n  width: calc(100% + 20px);\n  height: 30px;\n  transform-origin: top center;\n  transform: perspective(50px) rotateX(50deg);\n  z-index: 10;\n}\n\ndropdown-trigger {\n  display: inline-flex;\n  align-items: center;\n  cursor: pointer;\n  user-select: none;\n  position: relative;\n}\n\ndropdown-panel {\n  position: absolute;\n  top: 100%;\n  left: 0px;\n  z-index: var(--dp-panel-z-index, 20);\n  background-color: var(--dp-panel-bg-color, #ffffff);\n  box-shadow: var(--dp-panel-shadow, 0 2px 8px rgba(0, 0, 0, 0.15));\n  padding: var(--dp-panel-padding, 0.5rem 0);\n  min-width: 180px;\n  opacity: 0;\n  pointer-events: none;\n  overflow: hidden;\n  filter: blur(4px);\n  transform: translateY(5px) scale(0.98);\n  border-radius: var(--dp-panel-border-radius, 4px);\n  margin-top: var(--dp-panel-margin-top, -5px);\n  will-change: opacity, transform, filter;\n  transition: opacity var(--dp-transition-duration, 200ms) var(--dp-transition-timing, ease-out), transform var(--dp-transition-duration, 200ms) var(--dp-transition-timing, ease-out);\n}\n\ndropdown-panel[wide] {\n  width: 100%;\n  margin-top: var(--dp-menu-margin-top, 0px);\n  filter: none;\n  transform: none;\n  border-radius: 0;\n}\n\ndropdown-component:hover > dropdown-panel,\ndropdown-panel[aria-hidden=false] {\n  opacity: 1;\n  transform: translateY(0) scale(1);\n  pointer-events: auto;\n  filter: blur(0px);\n  visibility: visible;\n}\n\ndropdown-component:hover > dropdown-panel[wide],\ndropdown-panel[wide][aria-hidden=false] {\n  transform: none;\n  filter: none;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRyb3Bkb3duLWNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0UsNEJBQTRCO0VBQzVCLGdEQUFnRDtFQUNoRCw2QkFBNkI7RUFDN0IsNEJBQTRCO0VBQzVCLDJCQUEyQjtFQUMzQix5QkFBeUI7RUFDekIsK0JBQStCO0VBQy9CLGdDQUFnQztFQUNoQyxzQkFBc0I7QUFDeEI7O0FBRUE7RUFDRSxxQkFBcUI7QUFDdkI7QUFDQTtFQUNFLGlCQUFpQjtBQUNuQjs7QUFFQTs7RUFFRSxXQUFXO0VBQ1gsdUJBQXVCO0VBQ3ZCLGtCQUFrQjtFQUNsQixXQUFXO0VBQ1gsUUFBUTtFQUNSLHdCQUF3QjtFQUN4QixZQUFZO0VBQ1osNEJBQTRCO0VBQzVCLDJDQUEyQztFQUMzQyxXQUFXO0FBQ2I7O0FBRUE7RUFDRSxvQkFBb0I7RUFDcEIsbUJBQW1CO0VBQ25CLGVBQWU7RUFDZixpQkFBaUI7RUFDakIsa0JBQWtCO0FBQ3BCOztBQUVBO0VBQ0Usa0JBQWtCO0VBQ2xCLFNBQVM7RUFDVCxTQUFTO0VBQ1Qsb0NBQW9DO0VBQ3BDLG1EQUFtRDtFQUNuRCxpRUFBaUU7RUFDakUsMENBQTBDO0VBQzFDLGdCQUFnQjtFQUNoQixVQUFVO0VBQ1Ysb0JBQW9CO0VBQ3BCLGdCQUFnQjtFQUNoQixpQkFBaUI7RUFDakIsc0NBQXNDO0VBQ3RDLGlEQUFpRDtFQUNqRCw0Q0FBNEM7RUFDNUMsdUNBQXVDO0VBQ3ZDLG9MQUFvTDtBQUN0TDs7QUFFQTtFQUNFLFdBQVc7RUFDWCwwQ0FBMEM7RUFDMUMsWUFBWTtFQUNaLGVBQWU7RUFDZixnQkFBZ0I7QUFDbEI7O0FBRUE7O0VBRUUsVUFBVTtFQUNWLGlDQUFpQztFQUNqQyxvQkFBb0I7RUFDcEIsaUJBQWlCO0VBQ2pCLG1CQUFtQjtBQUNyQjs7QUFFQTs7RUFFRSxlQUFlO0VBQ2YsWUFBWTtBQUNkIiwiZmlsZSI6ImRyb3Bkb3duLWNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiOnJvb3Qge1xuICAtLWRwLXBhbmVsLWJnLWNvbG9yOiAjZmZmZmZmO1xuICAtLWRwLXBhbmVsLXNoYWRvdzogMCAycHggOHB4IHJnYmEoMCwgMCwgMCwgMC4xNSk7XG4gIC0tZHAtcGFuZWwtYm9yZGVyLXJhZGl1czogNHB4O1xuICAtLWRwLXBhbmVsLXBhZGRpbmc6IDAuNXJlbSAwO1xuICAtLWRwLXBhbmVsLW1hcmdpbi10b3A6IC01cHg7XG4gIC0tZHAtbWVudS1tYXJnaW4tdG9wOiAwcHg7XG4gIC0tZHAtdHJhbnNpdGlvbi1kdXJhdGlvbjogMjAwbXM7XG4gIC0tZHAtdHJhbnNpdGlvbi10aW1pbmc6IGVhc2Utb3V0O1xuICAtLWRwLXBhbmVsLXotaW5kZXg6IDIwO1xufVxuXG5kcm9wZG93bi1jb21wb25lbnQge1xuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG59XG5kcm9wZG93bi1jb21wb25lbnQ6Zm9jdXMge1xuICBiYWNrZ3JvdW5kOiBncmVlbjtcbn1cblxuZHJvcGRvd24tY29tcG9uZW50OmhvdmVyID4gZHJvcGRvd24tdHJpZ2dlcjo6YmVmb3JlLFxuZHJvcGRvd24tdHJpZ2dlclthcmlhLWV4cGFuZGVkPXRydWVdOjpiZWZvcmUge1xuICBjb250ZW50OiBcIlwiO1xuICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICBsZWZ0OiAtMTBweDtcbiAgdG9wOiA1MCU7XG4gIHdpZHRoOiBjYWxjKDEwMCUgKyAyMHB4KTtcbiAgaGVpZ2h0OiAzMHB4O1xuICB0cmFuc2Zvcm0tb3JpZ2luOiB0b3AgY2VudGVyO1xuICB0cmFuc2Zvcm06IHBlcnNwZWN0aXZlKDUwcHgpIHJvdGF0ZVgoNTBkZWcpO1xuICB6LWluZGV4OiAxMDtcbn1cblxuZHJvcGRvd24tdHJpZ2dlciB7XG4gIGRpc3BsYXk6IGlubGluZS1mbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIHVzZXItc2VsZWN0OiBub25lO1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG59XG5cbmRyb3Bkb3duLXBhbmVsIHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB0b3A6IDEwMCU7XG4gIGxlZnQ6IDBweDtcbiAgei1pbmRleDogdmFyKC0tZHAtcGFuZWwtei1pbmRleCwgMjApO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1kcC1wYW5lbC1iZy1jb2xvciwgI2ZmZmZmZik7XG4gIGJveC1zaGFkb3c6IHZhcigtLWRwLXBhbmVsLXNoYWRvdywgMCAycHggOHB4IHJnYmEoMCwgMCwgMCwgMC4xNSkpO1xuICBwYWRkaW5nOiB2YXIoLS1kcC1wYW5lbC1wYWRkaW5nLCAwLjVyZW0gMCk7XG4gIG1pbi13aWR0aDogMTgwcHg7XG4gIG9wYWNpdHk6IDA7XG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xuICBvdmVyZmxvdzogaGlkZGVuO1xuICBmaWx0ZXI6IGJsdXIoNHB4KTtcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDVweCkgc2NhbGUoMC45OCk7XG4gIGJvcmRlci1yYWRpdXM6IHZhcigtLWRwLXBhbmVsLWJvcmRlci1yYWRpdXMsIDRweCk7XG4gIG1hcmdpbi10b3A6IHZhcigtLWRwLXBhbmVsLW1hcmdpbi10b3AsIC01cHgpO1xuICB3aWxsLWNoYW5nZTogb3BhY2l0eSwgdHJhbnNmb3JtLCBmaWx0ZXI7XG4gIHRyYW5zaXRpb246IG9wYWNpdHkgdmFyKC0tZHAtdHJhbnNpdGlvbi1kdXJhdGlvbiwgMjAwbXMpIHZhcigtLWRwLXRyYW5zaXRpb24tdGltaW5nLCBlYXNlLW91dCksIHRyYW5zZm9ybSB2YXIoLS1kcC10cmFuc2l0aW9uLWR1cmF0aW9uLCAyMDBtcykgdmFyKC0tZHAtdHJhbnNpdGlvbi10aW1pbmcsIGVhc2Utb3V0KTtcbn1cblxuZHJvcGRvd24tcGFuZWxbd2lkZV0ge1xuICB3aWR0aDogMTAwJTtcbiAgbWFyZ2luLXRvcDogdmFyKC0tZHAtbWVudS1tYXJnaW4tdG9wLCAwcHgpO1xuICBmaWx0ZXI6IG5vbmU7XG4gIHRyYW5zZm9ybTogbm9uZTtcbiAgYm9yZGVyLXJhZGl1czogMDtcbn1cblxuZHJvcGRvd24tY29tcG9uZW50OmhvdmVyID4gZHJvcGRvd24tcGFuZWwsXG5kcm9wZG93bi1wYW5lbFthcmlhLWhpZGRlbj1mYWxzZV0ge1xuICBvcGFjaXR5OiAxO1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCkgc2NhbGUoMSk7XG4gIHBvaW50ZXItZXZlbnRzOiBhdXRvO1xuICBmaWx0ZXI6IGJsdXIoMHB4KTtcbiAgdmlzaWJpbGl0eTogdmlzaWJsZTtcbn1cblxuZHJvcGRvd24tY29tcG9uZW50OmhvdmVyID4gZHJvcGRvd24tcGFuZWxbd2lkZV0sXG5kcm9wZG93bi1wYW5lbFt3aWRlXVthcmlhLWhpZGRlbj1mYWxzZV0ge1xuICB0cmFuc2Zvcm06IG5vbmU7XG4gIGZpbHRlcjogbm9uZTtcbn0iXX0= */";
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

      // get panel element - use > to select only direct children
      _.panel = _.querySelector(':scope > dropdown-panel');

      // validate existence
      if (!_.trigger || !_.panel) {
        console.warn(
          'dropdown-component requires <dropdown-trigger> and <dropdown-panel> as direct children'
        );
        return;
      }

      // check if panel has 'wide' attribute for full-width layout
      if (_.panel.hasAttribute('wide')) {
        _.style.position = 'static';
      } else {
        _.style.position = 'relative';
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
    }
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

  exports.DropdownComponent = DropdownComponent;
  exports.DropdownPanel = DropdownPanel;
  exports.DropdownTrigger = DropdownTrigger;

}));
//# sourceMappingURL=dropdown-panel.js.map
