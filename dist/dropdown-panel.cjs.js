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

var css_248z = "dropdown-component {\n  display: inline-block;\n}\n\ndropdown-component:hover > dropdown-trigger::before,\ndropdown-trigger[aria-expanded=true]::before {\n  content: \"\";\n  position: absolute;\n  left: -10px;\n  top: 50%;\n  width: calc(100% + 20px);\n  height: 30px;\n  transform-origin: top center;\n  transform: perspective(50px) rotateX(50deg);\n  z-index: 10;\n}\n\ndropdown-component:has(> dropdown-panel[opens=right]):hover > dropdown-trigger::before,\ndropdown-trigger[aria-expanded=true]:has(~ dropdown-panel[opens=right])::before {\n  left: calc(100% - 30px);\n  top: -10px;\n  width: 40px;\n  height: calc(100% + 20px);\n  transform-origin: center left;\n  transform: perspective(50px) rotateY(-50deg);\n}\n\ndropdown-trigger {\n  position: relative;\n  cursor: pointer;\n  user-select: none;\n}\n\ndropdown-panel {\n  position: absolute;\n  top: 100%;\n  left: 0;\n  opacity: 0;\n  pointer-events: none;\n}\n\ndropdown-panel[opens=right] {\n  top: 0;\n  left: 100%;\n}\n\ndropdown-panel[wide] {\n  width: 100%;\n}\n\ndropdown-component:hover > dropdown-panel,\ndropdown-panel[aria-hidden=false] {\n  opacity: 1;\n  pointer-events: auto;\n  visibility: visible;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRyb3Bkb3duLWNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0UscUJBQXFCO0FBQ3ZCOztBQUVBOztFQUVFLFdBQVc7RUFDWCxrQkFBa0I7RUFDbEIsV0FBVztFQUNYLFFBQVE7RUFDUix3QkFBd0I7RUFDeEIsWUFBWTtFQUNaLDRCQUE0QjtFQUM1QiwyQ0FBMkM7RUFDM0MsV0FBVztBQUNiOztBQUVBOztFQUVFLHVCQUF1QjtFQUN2QixVQUFVO0VBQ1YsV0FBVztFQUNYLHlCQUF5QjtFQUN6Qiw2QkFBNkI7RUFDN0IsNENBQTRDO0FBQzlDOztBQUVBO0VBQ0Usa0JBQWtCO0VBQ2xCLGVBQWU7RUFDZixpQkFBaUI7QUFDbkI7O0FBRUE7RUFDRSxrQkFBa0I7RUFDbEIsU0FBUztFQUNULE9BQU87RUFDUCxVQUFVO0VBQ1Ysb0JBQW9CO0FBQ3RCOztBQUVBO0VBQ0UsTUFBTTtFQUNOLFVBQVU7QUFDWjs7QUFFQTtFQUNFLFdBQVc7QUFDYjs7QUFFQTs7RUFFRSxVQUFVO0VBQ1Ysb0JBQW9CO0VBQ3BCLG1CQUFtQjtBQUNyQiIsImZpbGUiOiJkcm9wZG93bi1jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbImRyb3Bkb3duLWNvbXBvbmVudCB7XG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbn1cblxuZHJvcGRvd24tY29tcG9uZW50OmhvdmVyID4gZHJvcGRvd24tdHJpZ2dlcjo6YmVmb3JlLFxuZHJvcGRvd24tdHJpZ2dlclthcmlhLWV4cGFuZGVkPXRydWVdOjpiZWZvcmUge1xuICBjb250ZW50OiBcIlwiO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIGxlZnQ6IC0xMHB4O1xuICB0b3A6IDUwJTtcbiAgd2lkdGg6IGNhbGMoMTAwJSArIDIwcHgpO1xuICBoZWlnaHQ6IDMwcHg7XG4gIHRyYW5zZm9ybS1vcmlnaW46IHRvcCBjZW50ZXI7XG4gIHRyYW5zZm9ybTogcGVyc3BlY3RpdmUoNTBweCkgcm90YXRlWCg1MGRlZyk7XG4gIHotaW5kZXg6IDEwO1xufVxuXG5kcm9wZG93bi1jb21wb25lbnQ6aGFzKD4gZHJvcGRvd24tcGFuZWxbb3BlbnM9cmlnaHRdKTpob3ZlciA+IGRyb3Bkb3duLXRyaWdnZXI6OmJlZm9yZSxcbmRyb3Bkb3duLXRyaWdnZXJbYXJpYS1leHBhbmRlZD10cnVlXTpoYXMofiBkcm9wZG93bi1wYW5lbFtvcGVucz1yaWdodF0pOjpiZWZvcmUge1xuICBsZWZ0OiBjYWxjKDEwMCUgLSAzMHB4KTtcbiAgdG9wOiAtMTBweDtcbiAgd2lkdGg6IDQwcHg7XG4gIGhlaWdodDogY2FsYygxMDAlICsgMjBweCk7XG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlciBsZWZ0O1xuICB0cmFuc2Zvcm06IHBlcnNwZWN0aXZlKDUwcHgpIHJvdGF0ZVkoLTUwZGVnKTtcbn1cblxuZHJvcGRvd24tdHJpZ2dlciB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICB1c2VyLXNlbGVjdDogbm9uZTtcbn1cblxuZHJvcGRvd24tcGFuZWwge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogMTAwJTtcbiAgbGVmdDogMDtcbiAgb3BhY2l0eTogMDtcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG59XG5cbmRyb3Bkb3duLXBhbmVsW29wZW5zPXJpZ2h0XSB7XG4gIHRvcDogMDtcbiAgbGVmdDogMTAwJTtcbn1cblxuZHJvcGRvd24tcGFuZWxbd2lkZV0ge1xuICB3aWR0aDogMTAwJTtcbn1cblxuZHJvcGRvd24tY29tcG9uZW50OmhvdmVyID4gZHJvcGRvd24tcGFuZWwsXG5kcm9wZG93bi1wYW5lbFthcmlhLWhpZGRlbj1mYWxzZV0ge1xuICBvcGFjaXR5OiAxO1xuICBwb2ludGVyLWV2ZW50czogYXV0bztcbiAgdmlzaWJpbGl0eTogdmlzaWJsZTtcbn0iXX0= */";
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
				// Only handle if panel is actually open
				if (_.panel.getAttribute('aria-hidden') === 'false') {
					event.preventDefault();
					event.stopPropagation(); // Prevent closing parent menus
					_.hide();
					_.trigger.focus();
				}
				// If panel is closed, do nothing - let event bubble to parent
			}
		});

		// hide panel when escape
		_.panel.addEventListener('keydown', (event) => {
			if (event.key === 'Escape') {
				event.preventDefault();
				event.stopPropagation(); // Prevent closing parent menus
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
//# sourceMappingURL=dropdown-panel.cjs.js.map
