# @magic-spells/dropdown-panel

A lightweight, accessible dropdown panel web component designed for modern web applications.

🔍 **[Live Demo](https://magic-spells.github.io/dropdown-panel/demo/)** - See it in action!

## Features

- 🪶 Lightweight and dependency-free
- 🌈 Fully customizable with CSS variables
- ⌨️ Keyboard accessible
- ♿ WAI-ARIA compliant
- 📱 Mobile-friendly

## Installation

```bash
npm install @magic-spells/dropdown-panel
```

## Usage

Import the component in your JavaScript:

```javascript
// ESM import
import '@magic-spells/dropdown-panel';

// Or in HTML
<script src="node_modules/@magic-spells/dropdown-panel/dist/dropdown-panel.min.js"></script>
<link rel="stylesheet" href="node_modules/@magic-spells/dropdown-panel/dist/dropdown-panel.min.css">
```

Then use it in your HTML:

```html
<dropdown-component>
  <dropdown-trigger>Menu</dropdown-trigger>
  <dropdown-panel>
    <a href="#" class="dropdown-item" role="menuitem">Option 1</a>
    <a href="#" class="dropdown-item" role="menuitem">Option 2</a>
    <div class="dropdown-divider"></div>
    <a href="#" class="dropdown-item" role="menuitem">Option 3</a>
  </dropdown-panel>
</dropdown-component>
```

For a larger "mega menu" style layout, use `<dropdown-menu>` instead of `<dropdown-panel>`:

```html
<dropdown-component>
  <dropdown-trigger>Products</dropdown-trigger>
  <dropdown-menu>
    <div>
      <a href="#" class="dropdown-item" role="menuitem">Software</a>
      <a href="#" class="dropdown-item" role="menuitem">Hardware</a>
      <a href="#" class="dropdown-item" role="menuitem">Services</a>
    </div>
    <div>
      <a href="#" class="dropdown-item" role="menuitem">Support</a>
      <a href="#" class="dropdown-item" role="menuitem">Community</a>
      <a href="#" class="dropdown-item" role="menuitem">Partners</a>
    </div>
  </dropdown-menu>
</dropdown-component>
```

## Component Types

This library provides two types of dropdown containers:

### `<dropdown-panel>`

- 🧩 **Popover-style panel**, great for short or simple option lists.
- Appears as a smaller, compact dropdown.
- Use when you need a small group of links or actions.

### `<dropdown-menu>`

- 🧩 **Mega menu style**, designed for larger, full-width menus.
- Supports multiple columns inside the menu for richer layouts.
- Use when you have multiple categories or larger navigation needs.

Both types are accessible, keyboard-friendly, and customizable!

## Styling

The component uses CSS custom properties (variables) for easy customization:

```css
:root {
  /* Panel appearance */
  --panel-bg-color: #ffffff;
  --panel-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  --panel-border-radius: 4px;
  --panel-padding: 0.5rem 0;
  --panel-margin-top: 0.25rem;

  /* Item styling */
  --item-padding: 0.5rem 1rem;
  --item-color: inherit;
  --item-hover-bg: #f0f5ff;

  /* Divider styling */
  --divider-color: #e9ecef;

  /* Animation */
  --transition-duration: 0.2s;
  --transition-timing: ease;
}
```

## API

### Components

- `<dropdown-component>`: The main container that coordinates everything
- `<dropdown-trigger>`: The element that toggles the dropdown open/close
- `<dropdown-panel>`: A compact popover dropdown for smaller lists
- `<dropdown-menu>`: A full-width, mega menu–style dropdown for large layouts

### Methods

```javascript
// Get reference to the component
const dropdown = document.querySelector('dropdown-component');

// Show the dropdown
dropdown.show();

// Hide the dropdown
dropdown.hide();
```

### Events

The dropdown component is fully compatible with standard event listeners:

```javascript
const dropdown = document.querySelector('dropdown-component');

dropdown.addEventListener('mouseleave', () => {
  // Do something when mouse leaves dropdown
});
```

## Accessibility

This component follows WAI-ARIA practices for dropdown menus:

- Proper ARIA roles, states, and properties
- Keyboard navigation (Tab, Space, Enter, Escape)
- Focus management
- `role="menuitem"` added for screen readers

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Other modern browsers that support Custom Elements v1

## License

MIT
