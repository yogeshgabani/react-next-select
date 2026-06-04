
<div align="center">

# react-next-select

**Accessible, SSR-safe React Select for Next.js.**

Single · multi · async · searchable · themable via CSS variables · keyboard-navigable · zero runtime deps · ESM + CJS.

[![npm](https://img.shields.io/npm/v/react-next-select.svg?color=4f46e5&style=flat-square)](https://www.npmjs.com/package/react-next-select)
[![types](https://img.shields.io/badge/types-included-3178c6?style=flat-square)](#typescript)
[![license](https://img.shields.io/badge/license-MIT-emerald?style=flat-square)](./LICENSE)
[![bundle](https://img.shields.io/badge/tree--shakable-✓-10b981?style=flat-square)](#performance)

</div>


> Accessible, SSR-safe React Select component for Next.js — single/multi, async, fully customizable.

Built in JavaScript (ES6+) with no external runtime dependencies, ships ESM + CJS, and works out of the box with the Next.js App Router and Pages Router.

## 🚀 Live Demo

**👉 [react-next-select.netlify.app](https://react-next-select.netlify.app/)**

Try every prop interactively, switch between light/dark themes, and customize the accent color live — the demo includes a Theme Studio, a Props Playground, and copy-ready code snippets for every variant.

## Features

- Single select and multi-select
- Searchable dropdown (inline or a separate in-menu search input)
- Async options loading with race-condition-safe requests
- Custom option / control / menu / indicator rendering
- Full keyboard navigation (Arrow / Home / End / Enter / Esc / Tab)
- Clearable input
- Disabled and loading states
- Controlled and uncontrolled support (`value`, `inputValue`, `menuIsOpen`)
- Hidden `<input name>` for native form submission
- SSR-safe behavior for Next.js (no `window`/`document` access on render)
- Zero runtime dependencies; React 18 and React 19 both supported

## Requirements

- React `^18.0.0` or `^19.0.0`
- React DOM `^18.0.0` or `^19.0.0`
- Node `>=16` (for build tooling only)

## Installation

```bash
npm install react-next-select
# or
yarn add react-next-select
# or
pnpm add react-next-select
```

Import the default stylesheet once in your app:

```js
import 'react-next-select/style.css'
```

> 💡 **Want a custom accent color (purple, indigo, emerald, anything)?**
> Just drop these 3 lines into your global CSS — the focus ring, selected option, hover, multi-value chips, scrollbar, and search icon all retint together. **No class overrides, no `!important`, nothing else to learn.**

```css
/* 🎨 Paste in app/globals.css (Next.js) or index.css (CRA/Vite) */
:root {
  --rns-accent: 167 139 250; /* purple — RGB triplet, no commas */
}
```

<details>
<summary><strong>🎨 More presets — click to expand (purple, indigo, blue, emerald, amber, rose)</strong></summary>

```css
/* Purple  */ :root { --rns-accent: 167 139 250; }
/* Indigo  */ :root { --rns-accent: 99  102 241; }
/* Blue    */ :root { --rns-accent: 56  189 248; }
/* Emerald */ :root { --rns-accent: 52  211 153; }
/* Amber   */ :root { --rns-accent: 251 191 36;  }
/* Rose    */ :root { --rns-accent: 244 114 182; }
```

Try them live → **[Theme Studio on the demo site](https://react-next-select.netlify.app/#theme-studio)** (pick a preset or paste any hex; the snippet updates and you can copy it).

</details>

<details>
<summary><strong>🌙 Dark mode — click to expand</strong></summary>

```css
/* Apply on :root or a [data-theme='dark'] wrapper */
[data-theme='dark'] {
  --rns-accent: 167 139 250;
  --rns-bg: #0f172a;
  --rns-text: #f8fafc;
  --rns-muted: #94a3b8;
  --rns-option-hover: #1e293b;
  --rns-disabled-bg: #1e293b;
}
```

</details>

> ➡️ Full variable reference and class-override / inline-style strategies are in the [**Styling**](#styling) section below.

## Next.js Usage

### App Router (`app/page.js`)

```jsx
'use client'

import { useState } from 'react'
import { Select } from 'react-next-select'
import 'react-next-select/style.css'

const options = [
  { value: 'next', label: 'Next.js' },
  { value: 'vite', label: 'Vite' },
  { value: 'rollup', label: 'Rollup' },
]

export default function Page() {
  const [value, setValue] = useState(null)

  return (
    <Select
      options={options}
      value={value}
      onChange={setValue}
      isClearable
      placeholder="Pick one..."
    />
  )
}
```

> The `'use client'` directive is required because `Select` is a client component (it manages local state and DOM focus).

### Pages Router (`pages/index.js`)

```jsx
import { useState } from 'react'
import { Select } from 'react-next-select'
import 'react-next-select/style.css'

const options = [
  { value: 'next', label: 'Next.js' },
  { value: 'vite', label: 'Vite' },
]

export default function Home() {
  const [value, setValue] = useState(null)
  return <Select options={options} value={value} onChange={setValue} />
}
```

### Multi-select

```jsx
<Select
  isMulti
  options={options}
  value={value}
  onChange={setValue}
  isClearable
/>
```

### Async options

```jsx
<Select
  loadOptions={async (input) => {
    const res = await fetch(`/api/search?q=${encodeURIComponent(input)}`)
    return res.json()
  }}
  defaultOptions
  placeholder="Search users..."
/>
```

## Full Example — Every Prop, Annotated

A copy-paste reference showing every prop with inline comments. Delete what you don't need — most props are optional.

```jsx
'use client'

import { useState } from 'react'
import { Select } from 'react-next-select'
import 'react-next-select/style.css'

// Each option is just an object. `value` + `label` is the default shape,
// but you can use any shape and tell Select how to read it via
// `getOptionValue` / `getOptionLabel` (see below).
const frameworks = [
  { value: 'next',   label: 'Next.js' },
  { value: 'remix',  label: 'Remix' },
  { value: 'vite',   label: 'Vite' },
  { value: 'astro',  label: 'Astro' },
  { value: 'nuxt',   label: 'Nuxt',   disabled: true }, // your own field — Select doesn't read it
]

export default function FullExample() {
  // Controlled value. Use `null` for single, `[]` for multi.
  // For uncontrolled mode, drop `value` + `onChange` and pass `defaultValue` instead.
  const [value, setValue]           = useState(null)
  const [inputValue, setInputValue] = useState('')   // controlled search text (optional)
  const [menuOpen, setMenuOpen]     = useState(false) // controlled menu (optional)

  return (
    <Select
      /* ──────────────── Data ──────────────── */
      options={frameworks}              // array of option objects
      // loadOptions={async (q) => { ... }}  // async mode — see "Async options" above
      // defaultOptions={true}               // preload async list on mount (or pass array)

      /* ──────────────── Value ──────────────── */
      value={value}                     // controlled selected value (object or array)
      onChange={(next, meta) => {
        // meta.action: 'select-option' | 'remove-value' | 'clear'
        // meta.option / meta.removedValue: which option changed
        setValue(next)
      }}
      // defaultValue={frameworks[0]}   // uncontrolled initial value (omit `value` to use this)

      /* ──────────────── Behaviour ──────────────── */
      isMulti={false}                   // true → multi-select with chips
      isSearchable={true}               // false → behaves like a native <select>
      isClearable={true}                // show ✕ button to clear selection
      isDisabled={false}                // greyed out, no interaction
      isLoading={false}                 // show loading message in menu (manual control)
      closeMenuOnSelect={undefined}     // default: true for single, false for multi
      blurInputOnSelect={true}          // blur after picking — set false to keep typing
      menuPlacement="bottom"            // 'bottom' | 'top'

      /* ──────────────── Search input (inside menu) ──────────────── */
      // When true, the search box renders INSIDE the menu instead of in the control.
      // Nice when the control shows many chips and you want a dedicated search row.
      showMenuSearchInput={false}
      menuSearchPlaceholder="Search options..."
      menuSearchInputProps={{           // extra props forwarded to the in-menu <input>
        // autoFocus: true,
        // 'data-testid': 'menu-search',
      }}

      /* ──────────────── Custom option shape ──────────────── */
      // Only needed if your options DON'T have `{ value, label }`.
      getOptionValue={(o) => o.value}   // unique id for the option
      getOptionLabel={(o) => o.label}   // string shown in control & menu
      // Custom rendering — return any JSX. `context` is 'menu' or 'value'.
      formatOptionLabel={(opt, { context }) =>
        context === 'menu'
          ? <span>🧩 {opt.label}</span>
          : opt.label
      }

      /* ──────────────── Filtering ──────────────── */
      // Override the built-in case-insensitive substring filter.
      filterOption={(option, input) =>
        option.label.toLowerCase().includes(input.toLowerCase())
      }

      /* ──────────────── Messages ──────────────── */
      placeholder="Pick a framework..."
      noOptionsMessage={({ inputValue }) =>
        inputValue ? `No match for "${inputValue}"` : 'No options'
      }
      loadingMessage={({ inputValue }) => `Searching "${inputValue}"...`}

      /* ──────────────── Controlled input / menu (advanced) ──────────────── */
      inputValue={inputValue}
      onInputChange={(v, meta) => {
        // meta.action: 'input-change' | 'menu-close' | 'clear'
        setInputValue(v)
      }}
      // defaultInputValue=""           // uncontrolled initial search text

      menuIsOpen={menuOpen}             // controlled menu state — omit for auto
      onMenuOpen={() => setMenuOpen(true)}
      onMenuClose={() => setMenuOpen(false)}

      /* ──────────────── Dropdown icon ──────────────── */
      // String, JSX, or render function. Wrapper rotates 180° on open automatically.
      dropdownIcon="⌄"
      // dropdownIcon={<ChevronDown size={14} />}
      // dropdownIcon={({ isOpen }) => (isOpen ? '−' : '+')}

      /* ──────────────── Styling ──────────────── */
      // Easiest: override CSS variables on :root (see "Theme via CSS variables" below).
      // For per-instance tweaks, use `styles` (returns a style object per slot):
      styles={{
        control: (base, state) => ({
          ...base,
          borderColor: state.isFocused ? '#6d28d9' : undefined,
        }),
        option: (base, state) => ({
          ...base,
          fontWeight: state.isSelected ? 600 : 400,
        }),
      }}

      /* ──────────────── Form integration ──────────────── */
      // Renders a hidden <input name={name}> with the serialized value
      // so the Select works inside a native <form>.
      name="framework"

      /* ──────────────── Accessibility & ids ──────────────── */
      id="framework-select"             // base id (auto-generated if omitted)
      aria-label="Framework"            // OR use aria-labelledby with a <label id>
      // aria-labelledby="framework-label"
      tabIndex={0}

      /* ──────────────── Class hooks ──────────────── */
      className="my-select"             // extra class on the wrapper
      classNamePrefix="rns"             // prefix for inner classes (.rns__control, ...)
      style={{ width: 320 }}            // inline style on the wrapper

      /* ──────────────── Custom subcomponents (advanced) ──────────────── */
      // Swap any built-in piece. All keys are optional.
      components={{
        // Option: ({ innerProps, data, isFocused, isSelected }) => (
        //   <div {...innerProps} className={isFocused ? 'is-hover' : ''}>
        //     <strong>{data.label}</strong>
        //   </div>
        // ),
        // ClearIndicator, DropdownIndicator, Control, ValueContainer,
        // IndicatorsContainer, Input, Menu, MenuList,
        // LoadingMessage, NoOptionsMessage, SingleValue, MultiValue,
      }}
    />
  )
}
```

### Minimal versions

If the full example feels heavy, here are the most common shapes — each works on its own:

```jsx
// 1. Bare minimum (uncontrolled)
<Select options={options} />

// 2. Controlled single-select
<Select options={options} value={value} onChange={setValue} isClearable />

// 3. Multi-select with chips
<Select options={options} value={values} onChange={setValues} isMulti isClearable />

// 4. Async with in-menu search box
<Select
  loadOptions={async (q) => fetch(`/api/search?q=${q}`).then(r => r.json())}
  defaultOptions
  showMenuSearchInput
  menuSearchPlaceholder="Type to search..."
/>

// 5. Inside a <form> — submits as a normal field
<form action="/submit" method="post">
  <Select options={options} name="country" />
  <button type="submit">Save</button>
</form>
```

## API

### Exports

```js
import {
  Select,             // main component
  defaultComponents,  // default subcomponent map (Control, Option, Menu, ...)
  mergeStyles,        // helper to merge styles from the `styles` prop
  SelectContext,      // React context exposing internal state
  useSelectContext,   // hook to read SelectContext from custom components
} from 'react-next-select'
```

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `options` | `Option[]` | `[]` | List of selectable options. |
| `value` | `Option \| Option[]` | — | Controlled selected value. |
| `defaultValue` | `Option \| Option[]` | `null` / `[]` | Uncontrolled initial value. |
| `onChange` | `(value, meta) => void` | — | Selection change callback. `meta.action` is one of `select-option`, `remove-value`, `clear`. |
| `isMulti` | `boolean` | `false` | Allow multiple values. |
| `isSearchable` | `boolean` | `true` | Enable search input. |
| `isClearable` | `boolean` | `false` | Show clear icon when a value is selected. |
| `isDisabled` | `boolean` | `false` | Disable the control. |
| `isLoading` | `boolean` | `false` | Show loading message in the menu. |
| `loadOptions` | `(inputValue) => Promise<Option[]>` | — | Async loader. Enables async mode. |
| `defaultOptions` | `boolean \| Option[]` | `false` | Preload options for async mode. |
| `filterOption` | `(option, input) => boolean` | — | Custom option filter for sync mode. |
| `getOptionValue` | `(option) => string` | `o => o.value` | Extract value from an option. |
| `getOptionLabel` | `(option) => string` | `o => o.label` | Extract label from an option. |
| `placeholder` | `string` | `'Select...'` | Placeholder text. |
| `noOptionsMessage` | `({ inputValue }) => string` | `() => 'No options'` | Message when filter returns nothing. |
| `loadingMessage` | `({ inputValue }) => string` | `() => 'Loading...'` | Message while async loading. |
| `inputValue` | `string` | — | Controlled search input. |
| `defaultInputValue` | `string` | `''` | Uncontrolled initial input value. |
| `onInputChange` | `(value, meta) => void` | — | Search input callback. |
| `menuIsOpen` | `boolean` | — | Controlled menu open state. |
| `onMenuOpen` / `onMenuClose` | `() => void` | — | Menu lifecycle callbacks. |
| `closeMenuOnSelect` | `boolean` | `!isMulti` | Close menu after selecting an option. |
| `blurInputOnSelect` | `boolean` | `true` | Blur the input after selecting. |
| `menuPlacement` | `'bottom' \| 'top'` | `'bottom'` | Menu placement relative to control. |
| `showMenuSearchInput` | `boolean` | `false` | Render a separate search input inside the menu. |
| `menuSearchPlaceholder` | `string` | `'Search...'` | Placeholder for the in-menu search input. |
| `menuSearchInputProps` | `object` | `{}` | Extra props for the in-menu search `<input>`. |
| `dropdownIcon` | `ReactNode \| ({ isOpen }) => ReactNode` | — | Replace just the chevron icon — accepts a string, element, or render function. The wrapper handles the 180° open/close rotation automatically. |
| `components` | `object` | — | Override internal subcomponents (`Control`, `Option`, `Menu`, `MenuList`, `Input`, `DropdownIndicator`, `ClearIndicator`, `SingleValue`, `MultiValue`, `LoadingMessage`, `NoOptionsMessage`). |
| `styles` | `object` | `{}` | Style override map (see Styling). |
| `formatOptionLabel` | `(option, { context }) => ReactNode` | — | Custom label renderer. `context` is `'menu'` or `'value'`. |
| `className` | `string` | — | Extra class on the wrapper. |
| `classNamePrefix` | `string` | `'rns'` | Prefix for inner element classNames. |
| `style` | `object` | — | Inline style on the wrapper. |
| `name` | `string` | — | Render a hidden `<input>` with the serialized value for form submission. |
| `id` | `string` | auto | Base id; used for the listbox and option ids. |
| `aria-label` / `aria-labelledby` | `string` | — | Accessibility labels. |
| `tabIndex` | `number` | `0` | Tab index on the control. |

`Option` is any object — `{ value, label }` by default — or anything else if you provide `getOptionValue` / `getOptionLabel`.

## Styling

Three styling strategies are supported and can be combined.

### 1) Theme via CSS variables (simplest)

The default stylesheet ships with `--rns-*` custom properties. Override any of them on `:root`, `body`, or a specific `.rns__wrapper` to retheme without writing any class overrides.

```css
:root {
  --rns-accent: 167 139 250;  /* purple — RGB triplet, no commas */
}
```

That one line restyles the focus border, focus ring, multi-value chips, and selected option together.

| Variable | Default | Purpose |
| --- | --- | --- |
| `--rns-accent` | `59 130 246` (RGB triplet) | Focus border + ring, selected option, hover, multi-value chip, scrollbar, search icon |
| `--rns-border` | `203 213 225` (RGB triplet) | Legacy border fallback (control/menu borders now derive from `--rns-accent`) |
| `--rns-bg` | `#fff` | Control + menu background |
| `--rns-text` | `#0f172a` | Main text color |
| `--rns-muted` | `#64748b` | Placeholder, icons, helper text |
| `--rns-option-hover` | `rgb(accent / 0.18)` | Option hover background (overrides the accent default) |
| `--rns-disabled-bg` | `#f8fafc` | Disabled control background |
| `--rns-radius` | `10px` | Corner radius (control, menu, search input) |
| `--rns-control-min-height` | `44px` | Minimum height of the control |
| `--rns-menu-max-height` | `320px` | Maximum height of the dropdown menu (includes optional search input) |

Color variables that need alpha transparency (`--rns-accent`, `--rns-border`) are expressed as **space-separated RGB triplets** so they can be combined with `rgb(... / <alpha>)` internally — write `167 139 250`, not `rgb(167, 139, 250)` or `#a78bfa`.

Dark theme example:

```css
[data-theme='dark'] {
  --rns-accent: 167 139 250;
  --rns-border: 71 85 105;
  --rns-bg: #0f172a;
  --rns-text: #f8fafc;
  --rns-muted: #94a3b8;
  --rns-option-hover: #1e293b;
  --rns-disabled-bg: #1e293b;
}
```

### 2) CSS class override

```jsx
import { Select } from 'react-next-select'
import 'react-next-select/style.css'
import './my-select-theme.css'

export default function Demo() {
  return (
    <Select
      options={[
        { value: 'next', label: 'Next.js' },
        { value: 'vite', label: 'Vite' },
      ]}
      className="mySelect"
      classNamePrefix="mySelect"
      isClearable
      showMenuSearchInput
      menuSearchPlaceholder="Search options..."
    />
  )
}
```

`my-select-theme.css`

```css
.mySelect__wrapper .rns__control {
  border: 1px solid #7c3aed;
  border-radius: 10px;
  background: #faf5ff;
}

.mySelect__wrapper .rns__control:focus-within {
  border-color: #6d28d9;
  box-shadow: 0 0 0 2px rgba(109, 40, 217, 0.25);
}

.mySelect__wrapper .rns__multi-value {
  background: #ede9fe;
  color: #4c1d95;
}

.mySelect__wrapper .rns__menu-inner {
  border: 1px solid #ddd6fe;
}

.mySelect__wrapper .rns__option:hover {
  background: #f5f3ff;
}

.mySelect__wrapper .rns__option[aria-selected='true'] {
  background: #ede9fe;
  color: #5b21b6;
}

.mySelect__wrapper .rns__menu-search-input-wrap {
  border-color: #c4b5fd;
}

.mySelect__wrapper .rns__menu-search-input {
  color: #1f2937;
}

.mySelect__wrapper .rns__menu-search-input::placeholder {
  color: #8b5cf6;
}

.mySelect__wrapper .rns__menu-search-icon {
  color: #7c3aed;
}

.mySelect__wrapper .rns__menu-search-clear {
  color: #7c3aed;
}
```

### 3) `styles` prop

```jsx
<Select
  options={options}
  styles={{
    control: (base, state) => ({
      ...base,
      borderColor: state.isFocused ? '#6d28d9' : '#c4b5fd',
      background: '#faf5ff',
      boxShadow: state.isFocused ? '0 0 0 2px rgba(109,40,217,0.25)' : 'none',
      borderRadius: 10,
    }),
    menu: (base) => ({
      ...base,
      border: '1px solid #ddd6fe',
      borderRadius: 10,
    }),
    option: (base, state) => ({
      ...base,
      background: state.isSelected ? '#ede9fe' : state.isFocused ? '#f5f3ff' : '#fff',
      color: state.isSelected ? '#5b21b6' : '#111827',
    }),
    multiValue: (base) => ({
      ...base,
      background: '#ede9fe',
      color: '#4c1d95',
    }),
  }}
/>
```

## Custom Dropdown Icon

Swap the default chevron without writing a full subcomponent — pass anything renderable to `dropdownIcon`. The wrapper rotates 180° on open/close, so any icon you provide animates automatically.

```jsx
// 1) String, emoji, or any character
<Select options={options} dropdownIcon="⌄" />

// 2) Any React node — your own SVG, an icon library, an image, etc.
import { ChevronDown } from 'lucide-react'

<Select options={options} dropdownIcon={<ChevronDown size={14} />} />

// 3) Render function — receives { isOpen } if you want different icons per state.
//    Tip: the wrapper still rotates 180°, so for stateful swaps either
//    return rotation-safe artwork or override `components.DropdownIndicator`.
<Select
  options={options}
  dropdownIcon={({ isOpen }) => (isOpen ? '−' : '+')}
/>
```

Need full control (different markup, no rotation, custom click handling)? Override the whole component instead:

```jsx
<Select
  components={{
    DropdownIndicator: ({ innerProps }) => (
      <button {...innerProps} className="my-caret" aria-hidden tabIndex={-1}>
        ▼
      </button>
    ),
  }}
/>
```

## Custom Components

Override any subcomponent through the `components` prop.

```jsx
function MyOption({ innerProps, data, isFocused }) {
  return (
    <div
      {...innerProps}
      style={{
        padding: '10px 12px',
        background: isFocused ? '#eff6ff' : '#fff',
      }}
    >
      <strong>{data.label}</strong>
    </div>
  )
}

<Select
  options={options}
  components={{
    Option: MyOption,
  }}
/>
```

Overridable component keys: `Control`, `ValueContainer`, `IndicatorsContainer`, `DropdownIndicator`, `ClearIndicator`, `Input`, `Menu`, `MenuList`, `Option`, `LoadingMessage`, `NoOptionsMessage`, `SingleValue`, `MultiValue`.

## Accessibility

- Control exposes `role="combobox"` with `aria-expanded`, `aria-controls`, `aria-haspopup="listbox"`.
- Each option exposes `role="option"` with `aria-selected`.
- The active option is tracked through `aria-activedescendant`.
- Pass `aria-label` or `aria-labelledby` to label the control when no visible label is associated.

## Build Output

- Bundler: Vite (library mode)
- Formats:
  - ESM: `dist/index.js`
  - CommonJS: `dist/index.cjs`
- Stylesheet: `dist/style.css`
- Sourcemaps included
- Peer dependencies: `react`, `react-dom` (kept external)

Build locally:

```bash
npm install
npm run build
```

Watch mode while developing:

```bash
npm run dev
```

## Publishing to npm

The `prepublishOnly` script runs `npm run build` automatically, so a fresh `dist/` is produced before each publish.

```bash
# 1. Bump the version
npm version patch   # or: minor / major

# 2. Login (first time only)
npm login

# 3. Publish
npm publish --access public
```

## Local Example App

A Next.js example app is included at `examples/`. You can also see it live at **[react-next-select.netlify.app](https://react-next-select.netlify.app/)**.

```bash
cd examples
npm install
npm run dev
```

## License

[MIT](./LICENSE) © 2026 **Yogesh Gabani**

Built by **Yogesh Gabani**.
