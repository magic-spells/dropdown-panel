'use strict';

function styleInject(css, ref) {
	if (ref === void 0) ref = {};
	var insertAt = ref.insertAt;

	if (!css || typeof document === 'undefined') {
		return;
	}

	var head =
		document.head || document.getElementsByTagName('head')[0];
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

var css_248z =
	'dropdown-component {\n  display: inline-block;\n}\n\ndropdown-component:hover > dropdown-trigger::before,\ndropdown-trigger[aria-expanded=true]::before {\n  content: "";\n  position: absolute;\n  left: -10px;\n  top: 50%;\n  width: calc(100% + 20px);\n  height: 30px;\n  transform-origin: top center;\n  transform: perspective(50px) rotateX(50deg);\n  z-index: 10;\n}\n\ndropdown-trigger {\n  position: relative;\n  cursor: pointer;\n  user-select: none;\n}\n\ndropdown-panel {\n  position: absolute;\n  top: 100%;\n  left: 0;\n  opacity: 0;\n  pointer-events: none;\n}\n\ndropdown-panel[wide] {\n  width: 100%;\n}\n\ndropdown-component:hover > dropdown-panel,\ndropdown-panel[aria-hidden=false] {\n  opacity: 1;\n  pointer-events: auto;\n  visibility: visible;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRyb3Bkb3duLWNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0UscUJBQXFCO0FBQ3ZCOztBQUVBOztFQUVFLFdBQVc7RUFDWCxrQkFBa0I7RUFDbEIsV0FBVztFQUNYLFFBQVE7RUFDUix3QkFBd0I7RUFDeEIsWUFBWTtFQUNaLDRCQUE0QjtFQUM1QiwyQ0FBMkM7RUFDM0MsV0FBVztBQUNiOztBQUVBO0VBQ0Usa0JBQWtCO0VBQ2xCLGVBQWU7RUFDZixpQkFBaUI7QUFDbkI7O0FBRUE7RUFDRSxrQkFBa0I7RUFDbEIsU0FBUztFQUNULE9BQU87RUFDUCxVQUFVO0VBQ1Ysb0JBQW9CO0FBQ3RCOztBQUVBO0VBQ0UsV0FBVztBQUNiOztBQUVBOztFQUVFLFVBQVU7RUFDVixvQkFBb0I7RUFDcEIsbUJBQW1CO0FBQ3JCIiwiZmlsZSI6ImRyb3Bkb3duLWNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiZHJvcGRvd24tY29tcG9uZW50IHtcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xufVxuXG5kcm9wZG93bi1jb21wb25lbnQ6aG92ZXIgPiBkcm9wZG93bi10cmlnZ2VyOjpiZWZvcmUsXG5kcm9wZG93bi10cmlnZ2VyW2FyaWEtZXhwYW5kZWQ9dHJ1ZV06OmJlZm9yZSB7XG4gIGNvbnRlbnQ6IFwiXCI7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgbGVmdDogLTEwcHg7XG4gIHRvcDogNTAlO1xuICB3aWR0aDogY2FsYygxMDAlICsgMjBweCk7XG4gIGhlaWdodDogMzBweDtcbiAgdHJhbnNmb3JtLW9yaWdpbjogdG9wIGNlbnRlcjtcbiAgdHJhbnNmb3JtOiBwZXJzcGVjdGl2ZSg1MHB4KSByb3RhdGVYKDUwZGVnKTtcbiAgei1pbmRleDogMTA7XG59XG5cbmRyb3Bkb3duLXRyaWdnZXIge1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgdXNlci1zZWxlY3Q6IG5vbmU7XG59XG5cbmRyb3Bkb3duLXBhbmVsIHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB0b3A6IDEwMCU7XG4gIGxlZnQ6IDA7XG4gIG9wYWNpdHk6IDA7XG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xufVxuXG5kcm9wZG93bi1wYW5lbFt3aWRlXSB7XG4gIHdpZHRoOiAxMDAlO1xufVxuXG5kcm9wZG93bi1jb21wb25lbnQ6aG92ZXIgPiBkcm9wZG93bi1wYW5lbCxcbmRyb3Bkb3duLXBhbmVsW2FyaWEtaGlkZGVuPWZhbHNlXSB7XG4gIG9wYWNpdHk6IDE7XG4gIHBvaW50ZXItZXZlbnRzOiBhdXRvO1xuICB2aXNpYmlsaXR5OiB2aXNpYmxlO1xufSJdfQ== */';
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
//# sourceMappingURL=dropdown-panel.cjs.js.map
