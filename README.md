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
    <a href="#" class="dropdown-item">Option 1</a>
    <a href="#" class="dropdown-item">Option 2</a>
    <div class="dropdown-divider"></div>
    <a href="#" class="dropdown-item">Option 3</a>
  </dropdown-panel>
</dropdown-component>
```

For a larger "mega menu" style layout, add the `wide` attribute to `<dropdown-panel>`:

```html
<dropdown-component>
  <dropdown-trigger>Products</dropdown-trigger>
  <dropdown-panel wide>
    <div>
      <a href="#" class="dropdown-item">Software</a>
      <a href="#" class="dropdown-item">Hardware</a>
      <a href="#" class="dropdown-item">Services</a>
    </div>
    <div>
      <a href="#" class="dropdown-item">Support</a>
      <a href="#" class="dropdown-item">Community</a>
      <a href="#" class="dropdown-item">Partners</a>
    </div>
  </dropdown-panel>
</dropdown-component>
```

## Panel Styles

The `<dropdown-panel>` component supports two layout styles via the `wide` attribute:

### Default (Popover Style)

- 🧩 **Compact popover panel**, positioned relative to the trigger button
- Great for short or simple option lists
- Includes smooth animation effects (blur, scale, transform)
- Use when you need a small group of links or actions

### Wide (Mega Menu Style)

- 🧩 **Full-width panel**, designed for larger navigation menus
- Add the `wide` attribute: `<dropdown-panel wide>`
- Supports multiple columns for richer layouts
- Use when you have multiple categories or larger navigation needs

Both styles are accessible, keyboard-friendly, and customizable!

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
- `<dropdown-panel>`: The dropdown content container (supports `wide` attribute for full-width mega menus)

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

This component follows web accessibility best practices:

- Semantic HTML structure without unnecessary ARIA menu roles
- ARIA states and properties (`aria-expanded`, `aria-controls`, `aria-hidden`, `aria-labelledby`)
- Keyboard navigation support (Tab, Space, Enter, Escape)
- Focus management
- `role="button"` on trigger for proper semantic meaning

Note: This component intentionally does not use ARIA `menu` or `menubar` roles, following [best practices for site navigation](https://adrianroselli.com/2017/10/dont-use-aria-menu-roles-for-site-nav.html). These roles are designed for application menus (like File/Edit menus in desktop software), not website navigation dropdowns.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Other modern browsers that support Custom Elements v1

## License

MIT
