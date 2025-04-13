/**
 * main dropdown component
 * manages interactions between <dropdown-trigger> and <dropdown-panel>
 * @class DropdownComponent
 * @extends HTMLElement
 */
export class DropdownComponent extends HTMLElement {
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
