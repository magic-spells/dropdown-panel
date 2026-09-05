# @magic-spells/dropdown-panel

A lightweight, accessible dropdown, popover and mega menu web component.

🔍 **[Live Demo](https://magic-spells.github.io/dropdown-panel/demo/)** - See it in action!

## Features

- 🪶 Dependency-free - 4.8 kB min + gzip (4.3 kB JS, 0.5 kB core CSS; the opt-in effects sheet adds 0.9 kB)
- 🎨 Minimal styling - the package sets positioning and open/closed state, and stops
- 🖱️ Hover, click, or both, per dropdown - `trigger="hover|click|both"`, with optional hover intent delays
- 🔗 Nested submenus with `opens="right"`
- 📐 Full-width mega menus with `wide`
- ⌨️ Keyboard navigation - arrows, `Home`/`End`, and `Escape` one level at a time
- ✨ Five optional entrance effects and a drawn trigger arrow, in a second opt-in stylesheet
- 🔔 Four cancelable lifecycle events
- 🍔 Opt-in `menu` mode - full APG menu button: roles, roving `tabindex`, typeahead, `select`
- 🖱️ Opt-in `trigger="contextmenu"` - right-click and long-press menus placed at the pointer
- ♿ Disclosure semantics by default - no ARIA menu roles unless you ask for them
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
| `menu`    | `<dropdown-component>`| absent   | Application-menu semantics: menu roles, roving `tabindex`, typeahead, `Tab` to close, `select` events. See below.        |
| `trigger` | `<dropdown-component>`| `both`   | `hover`, `click`, `both` or `contextmenu`.                                                                              |
| `open-delay` | `<dropdown-component>`| `0`   | Milliseconds `pointerenter` waits before opening. Leaving first cancels it. Hover only.                              |
| `close-delay` | `<dropdown-component>`| `0`  | Milliseconds `pointerleave` waits before closing a hover-opened panel. Re-entering cancels it.                       |
| `wide`    | `<dropdown-panel>`    | absent   | Full-width mega menu. `width: 100%`, host goes `position: static`.                                                       |
| `opens`   | `<dropdown-panel>`    | `down`   | `right` opens the panel beside the trigger instead of below it. For submenus.                                            |
| `align`   | `<dropdown-panel>`    | `start`  | `start` or `end`. Which edge of a downward panel lines up with the trigger. Pure CSS; `opens="right"` ignores it.        |
| `flip`    | `<dropdown-panel>`    | absent   | Opens the panel upward when it would run past the bottom of the viewport. Measured once per open.                        |
| `effect`  | `<dropdown-panel>`    | none     | `fade`, `slide`, `scale`, `blur` or `swing`. Requires the effects stylesheet; a no-op without it.                        |
| `arrow`   | `<dropdown-component>`| `flip`   | `flip` mirrors the trigger arrow on open, `static` leaves it alone, `none` hides it. Requires the effects stylesheet.    |
| `arrow-shape` | `<dropdown-component>`| `chevron` | `chevron` or `triangle`. Drawn only when the arrow hook is empty. Requires the effects stylesheet.                   |

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
<dropdown-component trigger="contextmenu"> <!-- right-click the component -->
```

- **`both`** - hover opens it where the pointer can hover, and click always toggles it.
- **`hover`** - hover only. Where `(hover: hover)` does not match, click takes over, so the menu is never unopenable on a phone.
- **`click`** - no hover path at all.
- **`contextmenu`** - no hover and no trigger click. A right-click (or a 500 ms touch long-press) anywhere in the component opens the panel at the pointer. See [Context menus](#context-menus).

Hover never fires for `pointerType: 'touch'`, so a tap on iOS toggles once instead of needing two.

#### Hover intent delays

`open-delay` and `close-delay`, in milliseconds, both default to `0` - the panel opens and closes the moment the pointer arrives and leaves.

```html
<dropdown-component trigger="hover" open-delay="150" close-delay="300">
  <dropdown-trigger>Products</dropdown-trigger>
  <dropdown-panel>…</dropdown-panel>
</dropdown-component>
```

- **`open-delay`** - `pointerenter` starts a timer and the panel opens when it fires. Leaving before then cancels it, so a pointer sweeping across a nav bar does not flash every menu open.
- **`close-delay`** - a hover-opened panel stays up for that long after `pointerleave`, and re-entering cancels the pending close. That is the forgiving version of the hover bridge: it covers a gap the bridge's geometry does not.

Both apply to hover only. Click, keyboard and the API never wait - they act immediately and cancel any pending timer. A click-opened panel latches, so `close-delay` never applies to it. Non-numeric and negative values are read as `0`.

A panel opened by **hover** closes when the pointer leaves. A panel opened by **click**, **keyboard** or the **API** latches: it stays until an outside pointerdown, `Escape`, or another dropdown opening. Clicking a hover-opened panel promotes it to click-open, so it latches rather than snapping shut under your cursor.

Opening any dropdown closes every other open one that is not an ancestor or descendant of it.

## Application menus

Everything above is a **disclosure**: a button that shows and hides a region. That is the
right pattern for site navigation, and it is what you get by default.

An application menu — File/Edit in a desktop app, a right-click menu, an actions menu on a
row — is a different pattern with a different keyboard contract. Add `menu` to the host and
the same markup becomes one:

```html
<dropdown-component menu>
  <dropdown-trigger>Edit</dropdown-trigger>
  <dropdown-panel>
    <div class="group-label">Document</div>
    <button type="button" data-value="save">Save</button>
    <button type="button" data-value="save-as">Save as…</button>
    <div role="separator"></div>
    <a href="/history" data-value="history">Version history</a>
    <span aria-disabled="true">Publish (offline)</span>

    <dropdown-component menu>
      <dropdown-trigger>Export</dropdown-trigger>
      <dropdown-panel opens="right">
        <button type="button" data-value="pdf">PDF</button>
        <button type="button" data-value="md">Markdown</button>
      </dropdown-panel>
    </dropdown-component>
  </dropdown-panel>
</dropdown-component>
```

**What changes.** `aria-haspopup="menu"` on the trigger, `role="menu"` on the panel (a role
you wrote yourself still wins), and `role="menuitem"` on every item that has no role of its
own. The items carry a **roving `tabindex`**: exactly one is `0`, and it follows focus, so the
whole menu is a single tab stop.

**What counts as an item.** `button:not([disabled])`, `a[href]`, anything with an authored
`menuitem` / `menuitemcheckbox` / `menuitemradio` role, and a nested submenu's
`<dropdown-trigger>`. Items are filtered to this panel, so a submenu's items belong to the
submenu. Anything with `disabled` or `aria-disabled="true"` is dropped: unreachable by arrow
and by typeahead, and clicking it fires nothing. Separators, group labels and plain text
match none of that, so they are skipped without any work on your part.

### Menu keyboard

| Key             | What it does                                                              |
| --------------- | ------------------------------------------------------------------------- |
| `Enter` `Space` | On the trigger: open and focus the first item. On an item: activate it.   |
| `↓` `↑`         | On a closed trigger: open on the first / last item. Inside: step, wrapping. |
| `Home` `End`    | First / last item.                                                        |
| a–z, 0–9        | Typeahead. Jumps to the next item whose text starts with what you typed.   |
| `→`             | On a submenu trigger: open it and focus its first item.                   |
| `←`             | Inside an `opens="right"` submenu: close it, focus its trigger.           |
| `Escape`        | Close this level only, and focus its trigger.                             |
| `Tab`           | **Close the menu** and move to the next tab stop.                         |

`Tab` is the one place the menu pattern parts company with disclosure — a disclosure panel
stays open so you can tab through it, a menu does not. That divergence is gated behind
`menu`, so nothing about a plain dropdown changes.

**Typeahead** buffers for 500 ms. `s` then `a` inside 500 ms jumps to "Save as…"; the same
character repeated (`s`, `s`, `s`) cycles the items starting with it. The buffer is dropped
on `Escape` and on close, and typing inside an `<input>` or `<textarea>` in the panel is left
alone.

**`Space` on a link.** A native `<a href>` does nothing on `Space`. In a menu it activates,
which is what the pattern promises.

### The `select` event

Every activation in a menu — click, `Enter` or `Space` — fires one
`dropdown-panel:select` on the component. It bubbles, is composed, and is cancelable.

```javascript
menu.addEventListener('dropdown-panel:select', (event) => {
  event.detail.item; // the activated element
  event.detail.value; // data-value, then the `value` attribute, then href, then null
});

// keep the menu open — a checkbox menu, a multi-select, an async confirm
menu.addEventListener('dropdown-panel:select', (event) => event.preventDefault());
```

Uncancelled, a selection closes the **whole chain**: the outermost `dropdown-component[menu]`
above the item is hidden, which cascades into every panel below it, and focus returns to that
root trigger. A link is the exception — it keeps focus, because it is about to navigate.

Opening a submenu is not a selection, so its `<dropdown-trigger>` never fires `select`.

**Checkbox and radio items.** An item with `role="menuitemcheckbox"` or `role="menuitemradio"`
fires `select` like any other, but does **not** close the menu. That is the whole policy: the
component writes no `aria-checked`, enforces no radio-group exclusivity, and keeps no value
set. Checked state is yours, which is what a controlled component wants anyway.

## Context menus

`trigger="contextmenu"` turns the component itself into a right-click surface. There is no
`<dropdown-trigger>` — the slotted content is the target area, and the panel is placed at the
pointer:

```html
<dropdown-component menu trigger="contextmenu">
  <div class="canvas">Right-click anywhere in here</div>
  <dropdown-panel>
    <button type="button" data-value="cut">Cut</button>
    <button type="button" data-value="copy">Copy</button>
  </dropdown-panel>
</dropdown-component>
```

- The panel goes `position: fixed` at the pointer, **flips** left and up when it would
  overflow, then **clamps** to an 8 px viewport margin. A panel taller than the viewport pins
  to that margin instead of hanging off the top. Those inline styles are cleared on close.
- **Touch:** a 500 ms long-press opens it at the touch point. Moving more than 10 px, lifting,
  or scrolling cancels the press.
- **Scrolling while it is open dismisses it** — a panel pinned to a point drifts away from
  what it was pointing at.
- A second right-click elsewhere **relocates** the open panel instead of opening a second one.
- Focus returns to whatever was focused before it opened, not to a trigger.
- `menu` and `trigger="contextmenu"` are independent. Together you get a menu at the pointer,
  which is usually what you want.

**`showAt(x, y)` is public**, so any element can be the surface:

```javascript
canvas.addEventListener('contextmenu', (event) => {
  event.preventDefault();
  menu.showAt(event.clientX, event.clientY);
});
```

## API

```javascript
const menu = document.querySelector('dropdown-component');

menu.show();
menu.hide(); // returns focus to the trigger if focus was inside
menu.hide({ restoreFocus: false });
menu.toggle();

menu.showAt(event.clientX, event.clientY); // open pinned to a point
menu.focusItem(0); // focus a panel item by index; negative and out-of-range wrap

menu.visible; // boolean, get and set - mirrors the `visible` attribute
menu.visible = true; // identical to menu.setAttribute('visible', '')

menu.triggerMode; // 'hover' | 'click' | 'both' | 'contextmenu' - the `trigger` ATTRIBUTE
menu.openDelay; // number, ms - the resolved `open-delay` attribute
menu.closeDelay; // number, ms - the resolved `close-delay` attribute
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

A fifth event, `dropdown-panel:select`, fires only in [`menu` mode](#application-menus).

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

Entrance effects and the trigger arrow live in a separate stylesheet so nobody pays for animation they did not ask for. Import it, then opt in per panel:

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

### The trigger arrow

The same stylesheet handles the little arrow inside the trigger. Mark it with `data-dropdown-arrow`:

```html
<dropdown-trigger>
  Menu<span data-dropdown-arrow aria-hidden="true"></span>
</dropdown-trigger>
```

Leave that element **empty** and the sheet draws the glyph for you. Put your own SVG inside it and the sheet draws nothing - it only handles the open/close behaviour. Either way the arrow is decorative, so give it `aria-hidden="true"`; hiding it visually is not the same as keeping it out of the accessibility tree.

`:empty` is literal - whitespace counts as content, so close the tag tight.

Two attributes, both on `<dropdown-component>`, so a submenu can differ from its parent:

```html
<dropdown-component arrow="static">          <!-- renders, never moves -->
<dropdown-component arrow="none">            <!-- hidden, markup untouched -->
<dropdown-component arrow-shape="triangle">  <!-- solid glyph, empty hook only -->
```

The default is `arrow="flip"` with `arrow-shape="chevron"`. The chevron is two bars pivoting about one point: each swings through the horizontal, so the pair passes through a single flat dash at the midpoint and lands mirrored. The triangle cannot flap, so it mirrors instead - `scaleY(-1)`, or `scaleX(-1)` on an `opens="right"` submenu, where the glyph also points the way it opens. Never a rotation: a mirror reverses identically on close where a spin unwinds.

`--dp-effect-duration` and `--dp-effect-easing` time the arrow too, and two more properties size the drawn glyph:

```css
dropdown-component {
  --dp-arrow-size: 0.64em; /* box the glyph fills */
  --dp-arrow-thickness: 1.5px; /* chevron bar weight */
}
```

Under `prefers-reduced-motion: reduce` the arrow still flips - it is a state readout, not decoration - but it lands on the new angle instantly instead of travelling.

**The hook has to be a real element**, never a pseudo-element on the trigger - see [The hover bridge](#the-hover-bridge).

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

**Right-aligned popovers** are an attribute, not a rule:

```html
<dropdown-panel align="end">…</dropdown-panel>
```

`align="start"` (the default) puts the panel's left edge on the trigger's left edge;
`align="end"` puts its right edge on the trigger's right. Both are pure CSS, both apply to
downward panels only — `opens="right"` positions sideways and ignores them.

> ⚠️ `align` is **physical**, not logical: `end` is the right edge in every writing mode. In a
> `dir="rtl"` container that reads as the *start* edge. Use `align="start"` there, or set
> `left`/`right` yourself.

**Panels near the fold** can flip upward:

```html
<dropdown-panel flip>…</dropdown-panel>
```

The component measures the panel once, right after it opens, and sets a `flipped` attribute
when the panel would run past the bottom of the viewport *and* there is room above the
trigger. `flipped` is cleared on close, so the next open re-measures — scroll back up and it
opens downward again. One measurement per open: no `ResizeObserver`, no scroll handler.

### The hover bridge

The invisible shape that keeps the pointer "inside" the component while it travels from the trigger to the panel is `dropdown-trigger::before`, gated behind `@media (hover: hover)` and rendered only while the component is hovered. It sits at `z-index: 10`; the panel ships at `z-index: 11` so an unstyled panel never has its first row eaten by the bridge.

**That `::before` belongs to the package.** Declaring your own on `dropdown-trigger` cascades onto the same box and breaks the bridge. So a dropdown arrow has to be a real child element, never a pseudo-element on the trigger:

```html
<!-- ✓ a real element - the sheet draws and animates it -->
<dropdown-trigger>
  Menu<span data-dropdown-arrow aria-hidden="true"></span>
</dropdown-trigger>

<!-- ✓ or your own glyph in the same hook -->
<dropdown-trigger>
  Menu<span data-dropdown-arrow aria-hidden="true">
    <svg viewBox="0 0 12 12" fill="currentColor"><path d="M6 8L2 4h8z" /></svg>
  </span>
</dropdown-trigger>

<!-- ✗ replaces the bridge -->
<style>
  dropdown-trigger::after { content: '▾'; }
</style>
```

The rule is about `dropdown-trigger` itself, not about pseudo-elements generally. `::before` and `::after` on the **hook element** are a different box entirely - that is exactly what the effects stylesheet uses to draw the chevron, and yours are welcome there too.

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

In [`menu` mode](#application-menus) the contract is different: the panel is one tab stop with
a roving `tabindex`, typeahead is live, `Enter`/`Space` on the trigger lands on the first item,
and `Tab` closes the menu. See [Menu keyboard](#menu-keyboard).

## Accessibility

- `role="button"`, `tabindex="0"`, `aria-haspopup="true"`, `aria-expanded` and `aria-controls` on the trigger.
- `role="group"` on the panel, unless you gave it one, so its `aria-labelledby` can actually carry the trigger's name.
- `aria-hidden` and `inert` on the panel track the open state. `inert` keeps a closed panel out of the tab order and out of find-in-page.
- Closing returns focus to the trigger, before `inert` lands - otherwise `inert` would blur the focused item to `<body>` and lose the user's place.

**No ARIA menu roles, by default.** Out of the box this component uses none of `menu`,
`menubar` or `menuitem`, following [best practices for site navigation](https://adrianroselli.com/2017/10/dont-use-aria-menu-roles-for-site-nav.html).
Those roles are for application menus (File/Edit in desktop software) and promise a keyboard
model site navigation rarely delivers. Write your items as real links or buttons and the rest
follows.

**`menu` is the deliberate opt-in** for the case those roles were actually made for — an
application menu or a context menu — and it comes with the keyboard model the roles promise:
roving `tabindex`, arrow navigation with wrap, `Home`/`End`, typeahead, `Enter`/`Space`
activation, submenus on `→`/`←`, and `Tab` to close. If your dropdown is site navigation, the
same article is the reason to leave `menu` off.

## Browser Support

The positioning depends on `:has()` - without it the host never becomes `position: relative` and every popover mispositions. Closed panels depend on `inert`. Together those set the floor:

- Chrome / Edge 105+
- Safari 15.5+
- Firefox 121+

There is no fallback for either, and no polyfill is loaded.

## License

MIT
