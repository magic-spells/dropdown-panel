# @magic-spells/dropdown-panel

A lightweight, accessible dropdown panel web component designed for modern web applications.

🔍 **[Live Demo](https://magic-spells.github.io/dropdown-panel/demo/)** - See it in action!

## Features

- 🪶 Lightweight and dependency-free (under 1KB CSS)
- 🎨 Minimal styling - easy to integrate with any design system
- 🔗 Supports nested dropdowns with `opens="right"` attribute
- ⌨️ Full keyboard navigation with progressive menu closure
- ♿ Accessible - follows ARIA best practices
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

For nested menus, use the `opens="right"` attribute to make panels open to the right:

```html
<dropdown-component>
  <dropdown-trigger>Resources</dropdown-trigger>
  <dropdown-panel>
    <a href="#" class="dropdown-item">Documentation</a>

    <!-- Nested dropdown -->
    <dropdown-component>
      <dropdown-trigger class="dropdown-item">Support</dropdown-trigger>
      <dropdown-panel opens="right">
        <a href="#" class="dropdown-item">Contact Us</a>
        <a href="#" class="dropdown-item">Help Center</a>
        <a href="#" class="dropdown-item">FAQ</a>
      </dropdown-panel>
    </dropdown-component>
  </dropdown-panel>
</dropdown-component>
```

## Panel Attributes

The `<dropdown-panel>` component supports the following attributes:

### `wide` - Full-Width Mega Menu

- 🧩 **Full-width panel**, designed for larger navigation menus
- Add the `wide` attribute: `<dropdown-panel wide>`
- Supports multiple columns for richer layouts
- Use when you have multiple categories or larger navigation needs

### `opens="right"` - Right-Opening Panels

- 🧩 **Right-opening panel**, perfect for nested menus
- Add `opens="right"` attribute: `<dropdown-panel opens="right">`
- Opens to the right of the trigger instead of below
- Use for submenus and nested navigation

### Default (Popover Style)

- 🧩 **Compact popover panel**, positioned below the trigger button
- No attributes needed - this is the default behavior
- Great for short or simple option lists
- Use when you need a small group of links or actions

All styles are accessible, keyboard-friendly, and customizable!

## Styling

**The component includes minimal styling by default.** This makes it easy to integrate into any project, whether you're using CSS, Tailwind, CSS-in-JS, or another approach.

The component includes only essential functional styles:

- Positioning logic (absolute/relative based on `wide` attribute)
- Show/hide visibility states
- Hover bridge for better UX

### Example: Custom CSS

```css
dropdown-panel {
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  padding: 0.5rem 0;
  min-width: 200px;
  border-radius: 4px;
  z-index: 1000;
  /* Avoid overflow: hidden - it clips nested panels */
}

/* Add animations for popover panels */
dropdown-panel:not([wide]) {
  transform: translateY(5px) scale(0.98);
  transition: all 200ms ease-out;
}

dropdown-component:hover > dropdown-panel:not([wide]),
dropdown-panel:not([wide])[aria-hidden='false'] {
  transform: translateY(0) scale(1);
}

/* Style dropdown items */
.dropdown-item {
  display: block;
  padding: 0.5rem 1rem;
  color: #333;
  text-decoration: none;
}

.dropdown-item:hover {
  background-color: #f0f5ff;
}
```

### Example: Tailwind CSS

```html
<dropdown-component>
  <dropdown-trigger class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
    Menu
  </dropdown-trigger>
  <dropdown-panel class="bg-white rounded-lg shadow-lg p-2 min-w-[200px] z-50">
    <a href="#" class="block px-4 py-2 hover:bg-gray-100 rounded">Option 1</a>
    <a href="#" class="block px-4 py-2 hover:bg-gray-100 rounded">Option 2</a>
  </dropdown-panel>
</dropdown-component>
```

### Adding Dropdown Indicators

Use HTML elements for dropdown arrows (not CSS pseudo-elements, which interfere with the hover bridge):

```html
<dropdown-trigger>
  Menu
  <span class="dropdown-arrow">
    <svg viewBox="0 0 12 12" fill="currentColor">
      <path d="M6 8L2 4h8z" />
    </svg>
  </span>
</dropdown-trigger>
```

**Important:** Avoid using `::after` or `::before` pseudo-elements on `dropdown-trigger` for visual indicators - they can block the invisible hover bridge that prevents the dropdown from closing.

See the [demo/index.html](demo/index.html) file for complete styling examples.

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
- Keyboard navigation support:
  - **Tab**: Move between focusable elements
  - **Space/Enter**: Toggle dropdown open/closed
  - **Escape**: Close current level only (nested menus close progressively)
- Focus management returns to trigger when closing
- `role="button"` on trigger for proper semantic meaning

**Nested Menu Behavior:** When Escape is pressed in a nested submenu, only that submenu closes and focus returns to its trigger. This allows users to navigate back through menu levels progressively.

Note: This component intentionally does not use ARIA `menu` or `menubar` roles, following [best practices for site navigation](https://adrianroselli.com/2017/10/dont-use-aria-menu-roles-for-site-nav.html). These roles are designed for application menus (like File/Edit menus in desktop software), not website navigation dropdowns.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Other modern browsers that support Custom Elements v1

## License

MIT
