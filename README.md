# @magic-spells/dropdown-panel

A lightweight, accessible dropdown panel web component designed for modern web applications.

## Features

- 🪶 Lightweight and dependency-free
- 🌈 Fully customizable with CSS variables
- ⌨️ Keyboard accessible
- ♿ WAI-ARIA compliant
- 📱 Mobile-friendly
- 🖱️ Hover or click activation

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

- `<dropdown-component>`: The main container
- `<dropdown-trigger>`: The element that toggles the dropdown
- `<dropdown-panel>`: The panel containing dropdown options

### Methods

```javascript
// Get reference to the component
const dropdown = document.querySelector('dropdown-component');

// Open the dropdown
dropdown.open();

// Close the dropdown
dropdown.close();
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
- Keyboard navigation (Tab, Space, Enter, Escape, arrow keys)
- Focus management

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Other modern browsers that support Custom Elements v1

## License

MIT