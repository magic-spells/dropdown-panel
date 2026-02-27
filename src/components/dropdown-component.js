/**
 * main dropdown component
 * manages interactions between <dropdown-trigger> and <dropdown-panel>
 * @class DropdownComponent
 * @extends HTMLElement
 */

let _uid = 0;

export class DropdownComponent extends HTMLElement {
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
		const panelId = _.panel.id || `dropdown-panel-${++_uid}`;
		_.panel.id = panelId;

		// assign unique id to trigger if needed (for aria-labelledby)
		if (!_.trigger.id) {
			_.trigger.id = `dropdown-trigger-${++_uid}`;
		}

		// initialize aria attributes
		_.trigger.setAttribute('aria-controls', panelId);
		_.trigger.setAttribute('aria-expanded', 'false');
		_.panel.setAttribute('aria-hidden', 'true');
		_.panel.setAttribute('aria-labelledby', _.trigger.id);

		// initial state
		_.hide();

		// store handler references for cleanup in disconnectedCallback
		_._onPointerEnter = (e) => {
			if (e.pointerType !== 'touch') _.show();
		};
		_._onPointerLeave = (e) => {
			if (e.pointerType !== 'touch') _.hide();
		};
		_._onDocumentPointerDown = (event) => {
			if (!_.contains(event.target)) {
				_.hide();
			}
		};
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

		// pointer enter and leave events (skip touch — touch uses click/tap only)
		_.addEventListener('pointerenter', _._onPointerEnter);
		_.addEventListener('pointerleave', _._onPointerLeave);

		// click/tap toggle on trigger
		_.trigger.addEventListener('click', _._onTriggerClick);

		// show or hide with enter/space, close with escape
		_.trigger.addEventListener('keydown', _._onTriggerKeydown);

		// hide panel when escape pressed inside panel
		_.panel.addEventListener('keydown', _._onPanelKeydown);
	}

	disconnectedCallback() {
		const _ = this;
		_.removeEventListener('pointerenter', _._onPointerEnter);
		_.removeEventListener('pointerleave', _._onPointerLeave);
		document.removeEventListener('pointerdown', _._onDocumentPointerDown);
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
		if (_.panel.getAttribute('aria-hidden') === 'false') return;
		_.panel.setAttribute('aria-hidden', 'false');
		_.panel.removeAttribute('inert');
		_.trigger.setAttribute('aria-expanded', 'true');
		document.addEventListener('pointerdown', _._onDocumentPointerDown);
	}

	hide() {
		const _ = this;
		if (_.panel.getAttribute('aria-hidden') === 'true') return;
		_.panel.setAttribute('aria-hidden', 'true');
		_.panel.setAttribute('inert', '');
		_.trigger.setAttribute('aria-expanded', 'false');
		document.removeEventListener('pointerdown', _._onDocumentPointerDown);
	}
}

// define the element
if (!customElements.get('dropdown-component')) {
	customElements.define('dropdown-component', DropdownComponent);
}
