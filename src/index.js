/**
 * @file Main entry point for dropdown-panel web component
 * @author Cory Schulz
 * @version 0.1.0
 */

// import styles
import './dropdown-component.scss';

// import components
import { DropdownComponent } from './components/dropdown-component.js';
import { DropdownTrigger } from './components/dropdown-trigger.js';
import { DropdownPanel } from './components/dropdown-panel.js';
import { DropdownMenu } from './components/dropdown-menu.js';

// export components for external use
export { DropdownComponent, DropdownTrigger, DropdownPanel };

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
