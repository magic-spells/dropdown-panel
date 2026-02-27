(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.DropdownPanel = {}));
})(this, (function (exports) { 'use strict';

	/**
	 * main dropdown component
	 * manages interactions between <dropdown-trigger> and <dropdown-panel>
	 * @class DropdownComponent
	 * @extends HTMLElement
	 */

	let _uid$1 = 0;

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

			// assign unique id to panel if needed
			const panelId = _.panel.id || `dropdown-panel-${++_uid$1}`;
			_.panel.id = panelId;

			// assign unique id to trigger if needed (for aria-labelledby)
			if (!_.trigger.id) {
				_.trigger.id = `dropdown-trigger-${++_uid$1}`;
			}

			// initialize aria attributes
			_.trigger.setAttribute('aria-controls', panelId);
			_.trigger.setAttribute('aria-expanded', 'false');
			_.panel.setAttribute('aria-hidden', 'true');
			_.panel.setAttribute('aria-labelledby', _.trigger.id);

			// initial state
			_.hide();

			// store handler references for cleanup in disconnectedCallback
			_._onMouseEnter = () => _.show();
			_._onMouseLeave = () => _.hide();
			_._onTriggerClick = () => _.toggle();
			_._onTriggerKeydown = (event) => {
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
			};
			_._onPanelKeydown = (event) => {
				if (event.key === 'Escape') {
					event.preventDefault();
					event.stopPropagation(); // Prevent closing parent menus
					_.hide();
					_.trigger.focus();
				}
			};

			// mouse enter and leave events on main dropdown-component element
			_.addEventListener('mouseenter', _._onMouseEnter);
			_.addEventListener('mouseleave', _._onMouseLeave);

			// click/tap toggle on trigger
			_.trigger.addEventListener('click', _._onTriggerClick);

			// show or hide with enter/space, close with escape
			_.trigger.addEventListener('keydown', _._onTriggerKeydown);

			// hide panel when escape pressed inside panel
			_.panel.addEventListener('keydown', _._onPanelKeydown);
		}

		disconnectedCallback() {
			const _ = this;
			_.removeEventListener('mouseenter', _._onMouseEnter);
			_.removeEventListener('mouseleave', _._onMouseLeave);
			if (_.trigger) {
				_.trigger.removeEventListener('click', _._onTriggerClick);
				_.trigger.removeEventListener('keydown', _._onTriggerKeydown);
			}
			if (_.panel) {
				_.panel.removeEventListener('keydown', _._onPanelKeydown);
			}
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

	let _uid = 0;

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
				_.id = `dropdown-trigger-${++_uid}`;
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
