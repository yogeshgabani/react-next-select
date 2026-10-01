
<div align="center">

# react-next-select

**Accessible, SSR-safe React Select for Next.js.**

Single · multi · async · searchable · themable via CSS variables · keyboard-navigable · zero runtime deps · ESM + CJS.

[![CI](https://github.com/yogeshgabani/react-next-select/actions/workflows/ci.yml/badge.svg)](https://github.com/yogeshgabani/react-next-select/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/react-next-select.svg?color=4f46e5&style=flat-square)](https://www.npmjs.com/package/react-next-select)
[![downloads](https://img.shields.io/npm/dm/react-next-select.svg?color=4f46e5&style=flat-square)](https://www.npmjs.com/package/react-next-select)
[![types](https://img.shields.io/badge/types-included-3178c6?style=flat-square)](#typescript)
[![license](https://img.shields.io/badge/license-MIT-emerald?style=flat-square)](./LICENSE)
[![bundle](https://img.shields.io/badge/tree--shakable-✓-10b981?style=flat-square)](#performance)

</div>


> Accessible, SSR-safe React Select component for Next.js — single/multi, async, fully customizable.

Built in JavaScript (ES6+) with no external runtime dependencies, ships ESM + CJS, and works out of the box with the Next.js App Router and Pages Router.

## 🚀 Live Demo

**👉 [react-next-select.netlify.app](https://react-next-select.netlify.app/)**

Try every prop interactively, switch between light/dark themes, and customize the accent color live — the demo includes a Theme Studio, a Props Playground, and copy-ready code snippets for every variant.

## Why react-next-select?

- **One prop themes it.** `<Select color="purple" />` retints the background, border, hover glow, focus ring, selected option and chips, each at a tuned opacity. 19 presets or any hex/rgb/hsl.
- **Built for Next.js.** SSR-safe, works in the App Router and Pages Router, no hydration warnings.
- **Batteries included.** Creatable options, select all, max limit, grouped options, icons + descriptions, match highlight, menu portal, async debounce — no plugins.
- **Small and dependency-free.** About 10 kB gzipped JS + 3 kB CSS, ESM + CJS, types included.
- **Accessible by default.** ARIA combobox/listbox, full keyboard support, disabled options skipped, `aria-invalid` on errors.
- **Tested.** 70 tests (Vitest + Testing Library) run in CI on every push.

## Features

- Single select and multi-select
- **Color props** — `color` (19 presets or any color), `bgColor`, `borderColor`, `focusColor`, `textColor`, `menuBgColor`, `chipColor`, … ([details](#color-props))
- **10 variants & 3 sizes** — `outline`, `filled`, `flushed`, `ghost`, `solid`, `elevated`, `glass`, `gradient`, `glow`, `pill`; `size="sm" | "md" | "lg"`, `radius`
- **Grouped options** — `{ label, options: [...] }` with search and keyboard nav across groups
- **Disabled options** — `option.isDisabled` or `isOptionDisabled`, skipped by the keyboard
- **Error state** — `isInvalid` (danger border + ring, `aria-invalid`)
- **Checkmarks** — `showCheckmark` for a ✓ on selected options
- **Creatable** — `isCreatable` + `onCreateOption` for "Create …" ([details](#creatable-options))
- **Select all & max limit** — `showSelectAll`, `maxSelected` ([details](#select-all--max-limit))
- **Icons, descriptions & match highlight** — `option.icon`, `option.description`, `highlightMatch`
- **Menu portal** — `menuPortalTarget` escapes modals and `overflow: hidden` ([details](#menu-portal))
- Searchable dropdown (inline or a separate in-menu search input)
- Async options loading with race-condition-safe requests and `debounceMs`
- Custom option / control / menu / indicator / group heading rendering
- Full keyboard navigation (Arrow / Home / End / Enter / Esc / Tab)
- Clearable input
- Disabled and loading states
- Menu placement `bottom`, `top`, or `auto` (flips up when there's no room below)
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

> 💡 **Want a custom color (purple, indigo, emerald, anything)?** Pass one prop:

```jsx
<Select options={options} color="purple" />            // a preset
<Select options={options} color="#7c3aed" />           // or any hex / rgb() / hsl()
<Select options={options} color="emerald" variant="filled" size="lg" />
```

See [Color props](#color-props) for all presets and per-part colors (`bgColor`, `borderColor`, …).

Prefer to theme **every** Select at once from CSS? Drop these lines into your global CSS — the focus ring, selected option, hover, multi-value chips, scrollbar, and search icon all retint together. **No class overrides, no `!important`.**

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
  debounceMs={300}   // one request after typing pauses, not one per keystroke
  placeholder="Search users..."
/>
```

Responses for older input are ignored, so results never arrive out of order.

## Color props

### `color` — one prop, every state

```jsx
<Select options={options} color="purple" />
```

From that one color, each part gets its own opacity, so it looks right on light and dark pages:

| Part | Look |
| --- | --- |
| Control background | soft 5% tint |
| Border | 35% → 60% on hover → 100% on focus |
| Hover | extra tint layer + soft colored glow |
| Focus | solid border + 3px ring at 22% |
| Option hover / selected | 18% / 40% |
| Multi-value chips | 25% fill, 35% border |
| Scrollbar, search icon, indicator hover | accent |

**19 presets:** `slate` `gray` `red` `orange` `amber` `yellow` `lime` `green` `emerald` `teal` `cyan` `sky` `blue` `indigo` `violet` `purple` `fuchsia` `pink` `rose`. The shades are picked so the focus border keeps at least 3:1 contrast on both white and dark (`#0f172a`) backgrounds.

Any other color works too: `color="#7c3aed"`, `color="rgb(124 58 237)"`, `color="hsl(262 83% 58%)"`.

### `variant`, `size`, `radius`

10 variants. Every one follows `color` and has its own hover and focus state:

| `variant` | Look | Good for |
| --- | --- | --- |
| `outline` *(default)* | border + soft tint | forms |
| `filled` | tinted fill, border appears on focus | dense forms, settings |
| `flushed` | bottom border only | minimal / inline forms |
| `ghost` | no chrome until hover or focus | toolbars, table cells |
| `solid` | the control **is** the color, white text | filters, call-to-action pickers |
| `elevated` | no border, soft shadow that lifts on hover | cards, light pages |
| `glass` | frosted, translucent, blurred backdrop | gradients, images, dark heroes |
| `gradient` | two-color gradient border | landing pages, highlights |
| `glow` | neon halo | dark UIs |
| `pill` | fully rounded control and chips | search bars, tags |

```jsx
<Select options={options} color="purple" variant="solid" />
<Select options={options} color="emerald" variant="gradient" />
<Select options={options} color="sky" variant="glass" />

<Select options={options} size="sm" />   {/* 34px */}
<Select options={options} size="md" />   {/* 44px (default) */}
<Select options={options} size="lg" />   {/* 52px */}

<Select options={options} radius={999} /> {/* number = px, or any CSS length */}
```

For `solid`, the `color` prop darkens the fill just enough for white text to reach at least 4.5:1 contrast. For `gradient`, it picks the second color by turning the hue 40° (purple → pink, emerald → blue). Theming from CSS instead? Set `--rns-accent-solid` and `--rns-accent-2` yourself.

### Per-part colors

Set exactly the parts you want. All accept any CSS color; anything you leave out still comes from `color`.

```jsx
<Select
  options={options}
  color="orange"               // hover, focus fallback, scrollbar, icons
  bgColor="#fff7ed"            // control + menu background (turns the tint off)
  borderColor="#fdba74"        // control border at rest
  focusColor="#ea580c"         // focus border + ring
  textColor="#7c2d12"          // value, input and option text
  placeholderColor="#c2410c"
  menuBgColor="#fff7ed"        // menu only (defaults to bgColor)
  optionHoverColor="#ffedd5"
  optionSelectedColor="#fed7aa"
  chipColor="#fed7aa"          // multi-value chips
  radius={8}
/>
```

### Theme a whole section — `getThemeVars()`

The color props just set `--rns-*` CSS variables. `getThemeVars()` returns the same variables, so you can theme every Select inside a container:

```jsx
import { Select, getThemeVars } from 'react-next-select'

<div style={getThemeVars({ color: 'emerald', radius: 12 })}>
  <Select options={a} />
  <Select options={b} isMulti />
</div>
```

`colorPresets` (name → `"r g b"`) and `toRgbTriplet(color)` are exported too.

## Grouped options

Any item with an `options` array is a group. Search filters inside groups (empty groups disappear) and arrow keys move across group boundaries. Groups and plain options can be mixed.

```jsx
const options = [
  { label: 'UI libraries', options: [
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
  ]},
  { label: 'Bundlers', options: [
    { value: 'vite', label: 'Vite' },
    { value: 'webpack', label: 'Webpack' },
  ]},
]

<Select options={options} isMulti showCheckmark />
```

Customize the heading with `components={{ GroupHeading }}`. It receives `data` (the group) and `innerProps` (spread them — they carry the `id` the group is labelled by).

## Disabled options

```jsx
const plans = [
  { value: 'free', label: 'Free' },
  { value: 'team', label: 'Team — coming soon', isDisabled: true },
]

<Select options={plans} />

// or decide with a function:
<Select options={plans} isOptionDisabled={(o) => o.seats > available} />
```

Disabled options are greyed out, can't be clicked, get `aria-disabled="true"`, and are skipped by Arrow / Home / End.

## Error state

```jsx
const [touched, setTouched] = useState(false)

<Select
  options={countries}
  value={country}
  onChange={setCountry}
  onMenuClose={() => setTouched(true)}
  isInvalid={touched && !country}
/>
```

`isInvalid` gives a danger-colored border and focus ring (`--rns-danger`, default `239 68 68`) and sets `aria-invalid="true"`.

## Creatable options

When the typed text matches nothing, `isCreatable` adds a **Create "…"** option at the end of the menu (Enter picks it).

```jsx
// 1) Let the Select pick it — the value gets { value, label, __isNew__: true }
<Select options={tags} isMulti isCreatable />

// 2) Or handle it yourself (save to an API, add to your list, ...)
const [tags, setTags] = useState(initialTags)
const [value, setValue] = useState([])

<Select
  options={tags}
  value={value}
  onChange={setValue}
  isMulti
  isCreatable
  onCreateOption={(text) => {
    const tag = { value: text, label: text }
    setTags((t) => [...t, tag])
    setValue((v) => [...v, tag])
  }}
/>
```

| Prop | Default |
| --- | --- |
| `formatCreateLabel(text)` | `` `Create "${text}"` `` |
| `isValidNewOption(text, selected, options)` | non-empty and no option/value has the same label (case-insensitive) |
| `getNewOptionData(text)` | `{ value: text, label: text }` |

The text is trimmed before it reaches `onCreateOption` / `getNewOptionData`. `onChange` reports `action: 'create-option'`.

## Select all & max limit

```jsx
<Select options={options} isMulti showSelectAll />
<Select options={options} isMulti maxSelected={3} />
<Select options={options} isMulti showSelectAll maxSelected={5} showCheckmark />
```

- **`showSelectAll`** adds a *Select all / Clear all* row at the top of the menu. It acts on the **visible** options, so with a search typed it selects just the matches. Disabled options are skipped. Rename it with `selectAllLabel` (a node, or `({ allSelected }) => node`). `onChange` reports `action: 'select-all'` / `'deselect-all'`.
- **`maxSelected`** disables the remaining options once the limit is reached; selected ones can still be removed. *Select all* stops at the limit.

## Icons, descriptions & match highlight

```jsx
const methods = [
  { value: 'card', label: 'Credit card', icon: '💳', description: 'Visa, Mastercard, Amex' },
  { value: 'upi',  label: 'UPI',         icon: <UpiLogo />, description: 'Instant' },
]

<Select options={methods} highlightMatch />
```

- `icon` (any node — emoji, `<svg>`, `<img>`) shows before the label in the menu, the selected value and chips.
- `description` shows as a muted second line in the menu.
- `highlightMatch` bolds and underlines the typed text inside each label.

These are skipped when you pass `formatOptionLabel` — then you're in charge of rendering.

## Menu portal

Inside a modal, a table cell or any `overflow: hidden` box, the menu gets clipped. Render it into `document.body` instead:

```jsx
<Select options={options} menuPortalTarget={document.body} />
```

In Next.js, `document` doesn't exist on the server, so pick the target after mount:

```jsx
const [portalTarget, setPortalTarget] = useState(null)
useEffect(() => setPortalTarget(document.body), [])

<Select options={options} menuPortalTarget={portalTarget} />
```

The menu stays attached while you scroll or resize, keeps its theme (color props and `--rns-*` variables are carried over), and works with `menuPlacement="auto"`. Change its stacking with `styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}`.

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
  { value: 'nuxt',   label: 'Nuxt',   isDisabled: true }, // greyed out, skipped by the keyboard
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
      blurInputOnSelect={undefined}     // default: true for single, false for multi
      menuPlacement="bottom"            // 'bottom' | 'top' | 'auto'
      isInvalid={false}                 // error border + ring, aria-invalid
      showCheckmark={false}             // ✓ next to selected options
      isOptionDisabled={(o) => !!o.isDisabled} // the default

      /* ──────────────── Colors & look ──────────────── */
      color="purple"                    // preset or any hex/rgb/hsl — tints every state
      variant="outline"                 // outline | filled | flushed | ghost | solid
                                        // elevated | glass | gradient | glow | pill
      size="md"                         // 'sm' | 'md' | 'lg'
      radius={10}                       // number = px
      // bgColor, borderColor, focusColor, textColor, placeholderColor,
      // menuBgColor, optionHoverColor, optionSelectedColor, chipColor

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
        // IndicatorsContainer, Input, Menu, MenuList, GroupHeading,
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
  getThemeVars,       // color props → --rns-* CSS variables (theme a container)
  colorPresets,       // { purple: '168 85 247', ... }
  toRgbTriplet,       // '#a855f7' | 'purple' | 'rgb(...)' → '168 85 247'
} from 'react-next-select'
```

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `options` | `(Option \| Group)[]` | `[]` | List of selectable options. A `Group` is `{ label, options: Option[] }`. |
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
| `blurInputOnSelect` | `boolean` | `!isMulti` | Blur the input after selecting. Multi keeps focus so the keyboard keeps working. |
| `debounceMs` | `number` | `0` | Async: wait this long after the last keystroke before calling `loadOptions`. |
| `isCreatable` | `boolean` | `false` | Offer a "Create …" option for new text. |
| `onCreateOption` | `(text) => void` | — | Handle a created option yourself (otherwise it's selected directly). |
| `formatCreateLabel` | `(text) => ReactNode` | `Create "text"` | Label of the create option. |
| `isValidNewOption` | `(text, selected, options) => boolean` | see [Creatable](#creatable-options) | When to offer the create option. |
| `getNewOptionData` | `(text) => Option` | `{ value, label }` | Shape of a created option. |
| `showSelectAll` | `boolean` | `false` | Multi: *Select all / Clear all* row for the visible options. |
| `selectAllLabel` | `ReactNode \| ({ allSelected }) => ReactNode` | `Select all` / `Clear all` | Label of that row. |
| `maxSelected` | `number` | — | Multi: disable the remaining options at this many. |
| `highlightMatch` | `boolean` | `false` | Bold + underline the typed text in option labels. |
| `menuPortalTarget` | `HTMLElement \| null` | — | Render the menu into this element (e.g. `document.body`). |
| `menuPlacement` | `'bottom' \| 'top' \| 'auto'` | `'bottom'` | Menu placement relative to control. `auto` opens upward when there isn't room below. |
| `isOptionDisabled` | `(option) => boolean` | `o => !!o.isDisabled` | Mark options unselectable; they're skipped by the keyboard. |
| `isInvalid` | `boolean` | `false` | Error state: danger border + ring, `aria-invalid`. |
| `showCheckmark` | `boolean` | `false` | Show a ✓ next to selected options in the menu. |
| `color` | preset \| CSS color | — | Accent: one of 19 presets or any hex / rgb() / hsl(). Tints background, border, hover, focus, selected option, chips. |
| `variant` | `'outline' \| 'filled' \| 'flushed' \| 'ghost' \| 'solid' \| 'elevated' \| 'glass' \| 'gradient' \| 'glow' \| 'pill'` | `'outline'` | Visual style of the control (see [variants](#variant-size-radius)). |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Control height, font size and option padding. |
| `radius` | `number \| string` | `10px` | Corner radius (number = px). |
| `bgColor` | CSS color | — | Control + menu background (turns the accent tint off). |
| `borderColor` | CSS color | — | Control border at rest. |
| `focusColor` | CSS color | accent | Focus border + ring. |
| `textColor` | CSS color | — | Value, input and option text. |
| `placeholderColor` | CSS color | — | Placeholder text. |
| `menuBgColor` | CSS color | `bgColor` | Menu background. |
| `optionHoverColor` | CSS color | accent 18% | Option hover background. |
| `optionSelectedColor` | CSS color | accent 40% | Selected option background. |
| `chipColor` | CSS color | accent 25% | Multi-value chip background + border. |
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

`Option` is any object — `{ value, label }` by default — or anything else if you provide `getOptionValue` / `getOptionLabel`. Optional fields the Select understands: `isDisabled`, `icon`, `description`.

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
| `--rns-tint` | `0` | Accent tint on the control background (0–1). The `color` prop sets `0.05`. |
| `--rns-accent-2` | `--rns-accent` (RGB triplet) | Second stop of the `gradient` variant. The `color` prop sets accent hue + 40°. |
| `--rns-accent-solid` | accent darkened 18% | Fill of the `solid` variant. The `color` prop darkens until white text reaches 4.5:1. |
| `--rns-on-accent` | `#fff` | Text on the `solid` variant |
| `--rns-border` | `203 213 225` (RGB triplet) | Legacy border fallback (control/menu borders now derive from `--rns-accent`) |
| `--rns-bg` | `#fff` | Control + menu background |
| `--rns-menu-bg` | `var(--rns-bg)` | Menu background |
| `--rns-text` | `#0f172a` | Main text color |
| `--rns-muted` | `#64748b` | Icons, helper text |
| `--rns-placeholder` | `#94a3b8` | Placeholder text |
| `--rns-control-border` | `rgb(accent / 0.35)` | Control border at rest |
| `--rns-focus-border` | `rgb(accent)` | Control border on focus |
| `--rns-focus-ring` | `rgb(accent / 0.22)` | Focus glow |
| `--rns-option-hover` | `rgb(accent / 0.18)` | Option hover background (overrides the accent default) |
| `--rns-option-selected` | `rgb(accent / 0.4)` | Selected option background |
| `--rns-chip-bg` / `--rns-chip-border` / `--rns-chip-text` | accent 25% / 35% / text | Multi-value chips |
| `--rns-danger` | `239 68 68` (RGB triplet) | `isInvalid` border + ring |
| `--rns-disabled-bg` | `#f8fafc` | Disabled control background |
| `--rns-radius` | `10px` | Corner radius (control, menu, search input) |
| `--rns-font-size` | `14px` | Base font size |
| `--rns-control-min-height` | `44px` | Minimum height of the control |
| `--rns-indicator-size` | `32px` | Clear / dropdown button size |
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

Overridable component keys: `Control`, `ValueContainer`, `IndicatorsContainer`, `DropdownIndicator`, `ClearIndicator`, `Input`, `Menu`, `MenuList`, `Option`, `GroupHeading`, `LoadingMessage`, `NoOptionsMessage`, `SingleValue`, `MultiValue`.

## TypeScript

Type definitions ship in the package (`dist/index.d.ts`, wired via `types`/`exports["."].types` in `package.json`) — no `@types/react-next-select` install needed.

```tsx
import { Select, SelectOption } from 'react-next-select'

interface City extends SelectOption {
  value: string
  label: string
}

const cities: City[] = [
  { value: 'ny', label: 'New York' },
  { value: 'sf', label: 'San Francisco' },
]

function CityPicker() {
  const [value, setValue] = useState<City | null>(null)
  return (
    <Select<City>
      options={cities}
      value={value}
      onChange={(next) => setValue(next as City | null)}
    />
  )
}
```

`SelectProps<Option>` is generic — pass your own option shape and `getOptionValue`/`getOptionLabel`/`onChange` stay typed to it.

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

Run the tests (Vitest + Testing Library; also run in CI and before every publish):

```bash
npm test          # once
npm run test:watch
```

## Publishing to npm

The `prepublishOnly` script runs the typecheck, the tests and the build automatically, so a broken build can't be published.

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
