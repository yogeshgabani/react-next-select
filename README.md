# react-next-select

> Accessible, SSR-safe React Select component for Next.js — single/multi, async, fully customizable.

Built in JavaScript (ES6+) with no external runtime dependencies, ships ESM + CJS, and works out of the box with the Next.js App Router and Pages Router.

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

Two styling strategies are supported and can be combined.

### 1) CSS override (recommended)

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

### 2) `styles` prop

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

A Next.js example app is included at `examples/next-example`:

```bash
cd examples/next-example
npm install
npm run dev
```

## License

[MIT](./LICENSE) © 2026 **Yogesh Gabani**

Built by **Yogesh Gabani**.
