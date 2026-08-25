# @magic-spells/dropdown-panel

A lightweight, accessible dropdown, popover and mega menu web component.

🔍 **[Live Demo](https://magic-spells.github.io/dropdown-panel/demo/)** - See it in action!

## Features

- 🪶 Dependency-free - 3.0 kB min + gzip (2.5 kB JS, 0.5 kB CSS)
- 🎨 Minimal styling - the package sets positioning and open/closed state, and stops
- 🖱️ Hover, click, or both, per dropdown - `trigger="hover|click|both"`
- 🔗 Nested submenus with `opens="right"`
- 📐 Full-width mega menus with `wide`
- ⌨️ Keyboard navigation - arrows, `Home`/`End`, and `Escape` one level at a time
- ✨ Five optional entrance effects, in a second opt-in stylesheet
- 🔔 Four cancelable lifecycle events
- ♿ Disclosure semantics - no ARIA menu roles
- 🧩 TypeScript definitions included

## Installation

```bash
npm install @magic-spells/dropdown-panel
```

## Usage

```javascript
import '@magic-spells/dropdown-panel';
import '@magic-spells/dropdown-panel/css';
import '@magic-spells/dropdown-panel/css/effects'; // optional
```

Or straight from a script tag. **Use `defer` (or `type="module"`)** so the elements upgrade after their children have parsed:

```html
<link
  rel="stylesheet"
  href="/node_modules/@magic-spells/dropdown-panel/dist/dropdown-panel.min.css" />
<script
  defer
  src="/node_modules/@magic-spells/dropdown-panel/dist/dropdown-panel.min.js"></script>
```

A blocking script still works - the component watches for late-arriving children and wires itself up when they show up, which also covers framework hydration - but `defer` skips that recovery path entirely.

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

`<dropdown-trigger>` and `<dropdown-panel>` must be **direct** children of `<dropdown-component>`.

### Mega menu

Add `wide` to the panel. The host goes `position: static` so the panel spans the nearest **positioned ancestor** rather than the trigger - give the element you want it to span `position: relative`. With no positioned ancestor the panel resolves `top: 100%` against the initial containing block and lands a viewport-height below the fold.

```html
<nav class="menubar">
  <!-- .menubar { position: relative } -->
  <dropdown-component>
    <dropdown-trigger>Products</dropdown-trigger>
    <dropdown-panel wide>
      <div>
        <a href="#" class="dropdown-item">Software</a>
        <a href="#" class="dropdown-item">Hardware</a>
      </div>
      <div>
        <a href="#" class="dropdown-item">Support</a>
        <a href="#" class="dropdown-item">Community</a>
      </div>
    </dropdown-panel>
  </dropdown-component>
</nav>
```

```css
.menubar {
  position: relative;
}

dropdown-panel[wide] {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1.5rem;
  padding: 1.5rem;
}
```

### Nested submenus

A dropdown inside a panel is just another dropdown. `opens="right"` moves its panel to `top: 0; left: 100%` and rotates the hover bridge onto the horizontal axis.

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
      </dropdown-panel>
    </dropdown-component>
  </dropdown-panel>
</dropdown-component>
```

`<dropdown-component>` is `display: inline-block`, so a nested one renders as a narrow inline row unless you make it a block:

```css
dropdown-panel dropdown-component {
  display: block;
}

dropdown-trigger.dropdown-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
```

**Nothing in the chain may set `overflow: hidden`** - it clips the submenu at the parent panel's edge.

## Attributes

| Attribute | Element               | Default  | Description                                                                                                             |
| --------- | --------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------- |
| `visible` | `<dropdown-component>`| absent   | Open state. Reflected and observed - add or remove it and the panel follows.                                             |
| `trigger` | `<dropdown-component>`| `both`   | `hover`, `click` or `both`.                                                                                             |
| `wide`    | `<dropdown-panel>`    | absent   | Full-width mega menu. `width: 100%`, host goes `position: static`.                                                       |
| `opens`   | `<dropdown-panel>`    | `down`   | `right` opens the panel beside the trigger instead of below it. For submenus.                                            |
| `effect`  | `<dropdown-panel>`    | none     | `fade`, `slide`, `scale`, `blur` or `swing`. Requires the effects stylesheet; a no-op without it.                        |

### `visible` is the state

`visible` on the host is the only state you write. `aria-expanded` on the trigger, and `aria-hidden` + `inert` on the panel, are **derived output** - the component writes them and will overwrite whatever you put there.

Style the open state off the host:

```css
dropdown-component[visible] > dropdown-trigger {
  color: #d8b043;
}
```

### Trigger modes

```html
<dropdown-component>                  <!-- both, the default -->
<dropdown-component trigger="hover">  <!-- fine pointers only -->
<dropdown-component trigger="click">  <!-- press to toggle -->
```

- **`both`** - hover opens it where the pointer can hover, and click always toggles it.
- **`hover`** - hover only. Where `(hover: hover)` does not match, click takes over, so the menu is never unopenable on a phone.
- **`click`** - no hover path at all.

Hover never fires for `pointerType: 'touch'`, so a tap on iOS toggles once instead of needing two.

A panel opened by **hover** closes when the pointer leaves. A panel opened by **click**, **keyboard** or the **API** latches: it stays until an outside pointerdown, `Escape`, or another dropdown opening. Clicking a hover-opened panel promotes it to click-open, so it latches rather than snapping shut under your cursor.

Opening any dropdown closes every other open one that is not an ancestor or descendant of it.

## API

```javascript
const menu = document.querySelector('dropdown-component');

menu.show();
menu.hide(); // returns focus to the trigger if focus was inside
menu.hide({ restoreFocus: false });
menu.toggle();

menu.visible; // boolean, get and set - mirrors the `visible` attribute
menu.visible = true; // identical to menu.setAttribute('visible', '')

menu.triggerMode; // 'hover' | 'click' | 'both' - the `trigger` ATTRIBUTE
menu.trigger; // the <dropdown-trigger> ELEMENT
menu.panel; // the <dropdown-panel> element
```

> ⚠️ `trigger` means two things. The `trigger` **attribute** holds the interaction mode; the `.trigger` **property** is the trigger element, kept as it was in v1.0.0. Read the mode with `.triggerMode`.

All three are idempotent. `show()` and `hide()` are also safe on an element whose children have not parsed yet - the intent is recorded on the `visible` attribute and applied once they do. `toggle()` needs a resolved element and no-ops before then.

### Events

Four events fire on `<dropdown-component>` and bubble, each carrying `detail: { trigger, panel }`.

| Event                        | Cancelable | Fires                                     |
| ---------------------------- | ---------- | ----------------------------------------- |
| `dropdown-panel:before-show` | Yes        | Before opening. `preventDefault()` aborts. |
| `dropdown-panel:show`        | No         | After the state turns open.               |
| `dropdown-panel:before-hide` | Yes        | Before closing. `preventDefault()` aborts. |
| `dropdown-panel:hide`        | No         | After the state turns closed.             |

```javascript
for (const name of ['before-show', 'show', 'before-hide', 'hide']) {
  menu.addEventListener(`dropdown-panel:${name}`, (event) => {
    console.log(name, event.detail.trigger, event.detail.panel);
  });
}

// cancelable - this menu refuses to open
menu.addEventListener('dropdown-panel:before-show', (e) => e.preventDefault());

// they bubble, so one listener on the nav hears every menu inside it
nav.addEventListener('dropdown-panel:show', (e) => track(e.detail.trigger));
```

You do not need these to keep one menu open at a time - the component already does that.

## Effects

Entrance effects live in a separate stylesheet so nobody pays for animation they did not ask for. Import it, then opt in per panel:

```javascript
import '@magic-spells/dropdown-panel/css/effects';
```

```html
<dropdown-panel effect="blur">…</dropdown-panel>
```

`fade`, `slide`, `scale`, `blur`, `swing`. Each one adapts to `wide` and `opens="right"`. Tune them with two custom properties, globally or per panel:

```css
dropdown-panel {
  --dp-effect-duration: 320ms;
  --dp-effect-easing: cubic-bezier(0.32, 0.72, 0, 1);
}
```

Under `prefers-reduced-motion: reduce` every effect degrades to the plain opacity fade.

Without the effects stylesheet the `effect` attribute does nothing, and panels use the core 200ms opacity fade. That core fade is a fixed 200ms - `--dp-effect-duration` only reaches panels that carry an `effect`.

## Styling

The core stylesheet is 1,019 bytes minified. It sets `position`, `opacity`, `pointer-events`, `z-index` and an opacity transition, plus the hover bridge. Everything visual is yours.

```css
dropdown-panel {
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  padding: 0.5rem 0;
  min-width: 200px;
  z-index: 1000;
  /* never overflow: hidden - it clips nested panels */
}

.dropdown-item {
  display: block;
  padding: 0.5rem 1rem;
  color: #333;
  text-decoration: none;
}

.dropdown-item:hover,
.dropdown-item:focus-visible {
  background-color: #f0f5ff;
}
```

**Open-state selectors.** The panel's shown state is `dropdown-panel[aria-hidden='false']` - the same selector the package uses. Anything you animate needs both halves:

```css
dropdown-panel {
  transform: translateY(5px) scale(0.98);
  transition-property: opacity, transform;
  transition-duration: 200ms;
}

dropdown-panel[aria-hidden='false'] {
  transform: none;
}
```

**Use transition longhands.** The package declares `transition-property`, `transition-duration` and `transition-timing-function` separately on purpose. Writing the `transition:` shorthand resets every longhand you did not name, including the package's own - so either restate all of them, or override one longhand at a time.

**Right-aligned popovers:**

```css
dropdown-panel {
  left: auto;
  right: 0;
}
```

### The hover bridge

The invisible shape that keeps the pointer "inside" the component while it travels from the trigger to the panel is `dropdown-trigger::before`, gated behind `@media (hover: hover)` and rendered only while the component is hovered. It sits at `z-index: 10`; the panel ships at `z-index: 11` so an unstyled panel never has its first row eaten by the bridge.

**That `::before` belongs to the package.** Declaring your own on `dropdown-trigger` cascades onto the same box and breaks the bridge. Use a real element for dropdown arrows:

```html
<dropdown-trigger>
  Menu
  <span class="dropdown-arrow" aria-hidden="true">
    <svg viewBox="0 0 12 12" fill="currentColor">
      <path d="M6 8L2 4h8z" />
    </svg>
  </span>
</dropdown-trigger>
```

### Tailwind

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

See [demo/index.html](demo/index.html) for a complete, working theme.

## Keyboard

| Key             | Where                                        | What it does                                        |
| --------------- | -------------------------------------------- | --------------------------------------------------- |
| `Tab`           | anywhere                                     | Normal tab order. A closed panel is `inert`, so its contents are skipped. |
| `Enter` `Space` | on the trigger                               | Toggle.                                             |
| `↓`             | on a closed trigger                          | Open and focus the first item.                      |
| `↑`             | on a closed trigger                          | Open and focus the last item.                       |
| `↓` `↑`         | focus inside an open panel                   | Previous / next item, wrapping at the ends.         |
| `Home` `End`    | focus inside an open panel                   | First / last item.                                  |
| `→`             | on a submenu trigger with `opens="right"`    | Open it and focus the first item.                   |
| `←`             | focus inside an `opens="right"` panel        | Close it and return focus to its trigger.           |
| `Escape`        | while open                                   | Close this level only, and focus its trigger.       |

Only the innermost open dropdown answers a key, so a nested menu never takes its parents down with it. Arrow keys are left alone inside `input`, `textarea`, `select` and `contenteditable`, where they belong to the field.

Focus leaving a panel does not close it - you need to be able to tab through the links inside.

## Accessibility

- `role="button"`, `tabindex="0"`, `aria-haspopup="true"`, `aria-expanded` and `aria-controls` on the trigger.
- `role="group"` on the panel, unless you gave it one, so its `aria-labelledby` can actually carry the trigger's name.
- `aria-hidden` and `inert` on the panel track the open state. `inert` keeps a closed panel out of the tab order and out of find-in-page.
- Closing returns focus to the trigger, before `inert` lands - otherwise `inert` would blur the focused item to `<body>` and lose the user's place.

This component intentionally does not use ARIA `menu`, `menubar` or `menuitem` roles, following [best practices for site navigation](https://adrianroselli.com/2017/10/dont-use-aria-menu-roles-for-site-nav.html). Those roles are for application menus (File/Edit in desktop software) and promise a keyboard model site navigation rarely delivers. Write your items as real links or buttons and the rest follows.

## Browser Support

The positioning depends on `:has()` - without it the host never becomes `position: relative` and every popover mispositions. Closed panels depend on `inert`. Together those set the floor:

- Chrome / Edge 105+
- Safari 15.5+
- Firefox 121+

There is no fallback for either, and no polyfill is loaded.

## License

MIT
