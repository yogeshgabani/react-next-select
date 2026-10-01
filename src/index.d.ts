import type { ComponentType, Context, CSSProperties, ReactNode } from 'react'

/** A single selectable item. Shape is up to you — override `getOptionValue`/`getOptionLabel` for custom shapes. */
export interface SelectOption {
  value: unknown
  label: ReactNode
  /** Rendered before the label in the menu, the value and chips. */
  icon?: ReactNode
  /** Second, muted line under the label in the menu. */
  description?: ReactNode
  isDisabled?: boolean
  /** Set on options created through `isCreatable`. */
  __isNew__?: boolean
  [key: string]: unknown
}

/** A labelled group of options: `{ label: 'Fruits', options: [...] }`. */
export interface SelectGroup<Option = SelectOption> {
  label: ReactNode
  options: Option[]
  [key: string]: unknown
}

export type SelectValue<Option> = Option | Option[] | null | undefined

/** Named accent presets accepted by the `color` prop. */
export type SelectColorPreset =
  | 'slate'
  | 'gray'
  | 'red'
  | 'orange'
  | 'amber'
  | 'yellow'
  | 'lime'
  | 'green'
  | 'emerald'
  | 'teal'
  | 'cyan'
  | 'sky'
  | 'blue'
  | 'indigo'
  | 'violet'
  | 'purple'
  | 'fuchsia'
  | 'pink'
  | 'rose'

export type SelectVariant =
  | 'outline'
  | 'filled'
  | 'flushed'
  | 'ghost'
  | 'solid'
  | 'elevated'
  | 'glass'
  | 'gradient'
  | 'glow'
  | 'pill'

export type SelectSize = 'sm' | 'md' | 'lg'

/** Color props shared by `<Select>` and `getThemeVars()`. */
export interface SelectThemeProps {
  /** Accent color — a preset name or any hex / rgb() / hsl() value. Retints border, hover, focus ring, selected option and chips, and gives the control a soft tinted background. */
  color?: SelectColorPreset | (string & {})
  /** Control + menu background (any CSS color). Disables the accent tint. */
  bgColor?: string
  /** Control border at rest. Hover and focus still use `color`. */
  borderColor?: string
  /** Border + glow while focused. */
  focusColor?: string
  /** Value, input and option text. */
  textColor?: string
  placeholderColor?: string
  /** Menu background (defaults to `bgColor`). */
  menuBgColor?: string
  optionHoverColor?: string
  optionSelectedColor?: string
  /** Multi-value chip background + border. */
  chipColor?: string
  /** Corner radius — a number is treated as px. */
  radius?: number | string
}

export interface OnChangeMeta<Option> {
  action:
    | 'select-option'
    | 'remove-value'
    | 'clear'
    | 'input-change'
    | 'menu-close'
    | 'create-option'
    | 'select-all'
    | 'deselect-all'
  option?: Option
  /** Options added by 'select-all'. */
  options?: Option[]
  removedValue?: Option
  removedValues?: Option[]
}

export interface InputActionMeta {
  action: 'input-change' | 'menu-close' | 'clear'
  prevInputValue: string
}

export interface SelectContextValue<Option = SelectOption> {
  isOpen: boolean
  isDisabled: boolean
  isMulti: boolean
  isSearchable: boolean
  inputValue: string
  highlightedIndex: number
  displayOptions: Option[]
  value: SelectValue<Option>
  getOptionValue: (option: Option) => unknown
  getOptionLabel: (option: Option) => ReactNode
  classNamePrefix: string
}

export interface SelectComponentProps<Option = SelectOption> {
  innerProps?: Record<string, unknown>
  selectProps?: SelectProps<Option>
  children?: ReactNode
  data?: Option
  isSelected?: boolean
  isFocused?: boolean
  isDisabled?: boolean
  style?: CSSProperties
  removeProps?: Record<string, unknown>
}

export interface SelectComponents<Option = SelectOption> {
  Control?: ComponentType<SelectComponentProps<Option>>
  ValueContainer?: ComponentType<SelectComponentProps<Option>>
  IndicatorsContainer?: ComponentType<SelectComponentProps<Option>>
  DropdownIndicator?: ComponentType<SelectComponentProps<Option>>
  ClearIndicator?: ComponentType<SelectComponentProps<Option>>
  Input?: ComponentType<SelectComponentProps<Option>>
  Menu?: ComponentType<SelectComponentProps<Option>>
  MenuList?: ComponentType<SelectComponentProps<Option>>
  Option?: ComponentType<SelectComponentProps<Option>>
  GroupHeading?: ComponentType<
    Omit<SelectComponentProps<Option>, 'data'> & { data?: SelectGroup<Option> }
  >
  LoadingMessage?: ComponentType<SelectComponentProps<Option>>
  NoOptionsMessage?: ComponentType<SelectComponentProps<Option>>
  SingleValue?: ComponentType<SelectComponentProps<Option>>
  MultiValue?: ComponentType<SelectComponentProps<Option>>
}

export type StyleFn = (
  base: CSSProperties,
  state: Record<string, unknown>,
) => CSSProperties | void

export interface SelectStyles {
  container?: CSSProperties | StyleFn
  control?: CSSProperties | StyleFn
  menu?: CSSProperties | StyleFn
  menuSearchWrap?: CSSProperties | StyleFn
  menuSearchInputWrap?: CSSProperties | StyleFn
  menuSearchInput?: CSSProperties | StyleFn
  menuSearchIcon?: CSSProperties | StyleFn
  menuSearchClear?: CSSProperties | StyleFn
  option?: CSSProperties | StyleFn
  multiValue?: CSSProperties | StyleFn
  /** The fixed box a portaled menu hangs from — spread `base`, it carries the position. */
  menuPortal?: CSSProperties | StyleFn
  [key: string]: CSSProperties | StyleFn | undefined
}

export interface SelectProps<Option = SelectOption> extends SelectThemeProps {
  /** Flat options, groups (`{ label, options }`), or a mix of both. */
  options?: Array<Option | SelectGroup<Option>>
  value?: SelectValue<Option>
  defaultValue?: SelectValue<Option>
  onChange?: (value: SelectValue<Option>, meta: OnChangeMeta<Option>) => void
  isMulti?: boolean
  isSearchable?: boolean
  showMenuSearchInput?: boolean
  menuSearchPlaceholder?: string
  menuSearchInputProps?: Record<string, unknown>
  isClearable?: boolean
  isDisabled?: boolean
  isLoading?: boolean
  loadOptions?: (
    inputValue: string,
  ) =>
    | Promise<Array<Option | SelectGroup<Option>>>
    | Array<Option | SelectGroup<Option>>
  defaultOptions?: boolean | Array<Option | SelectGroup<Option>>
  filterOption?:
    | ((option: Option, inputValue: string) => boolean)
    | null
  getOptionValue?: (option: Option) => unknown
  getOptionLabel?: (option: Option) => ReactNode
  placeholder?: ReactNode
  noOptionsMessage?: (args: { inputValue: string }) => ReactNode
  loadingMessage?: (args: { inputValue: string }) => ReactNode
  components?: Partial<SelectComponents<Option>>
  className?: string
  classNamePrefix?: string
  style?: CSSProperties
  styles?: SelectStyles
  inputValue?: string
  defaultInputValue?: string
  onInputChange?: (value: string, meta: InputActionMeta) => void
  onMenuOpen?: () => void
  onMenuClose?: () => void
  menuIsOpen?: boolean
  closeMenuOnSelect?: boolean
  /** Blur the input after picking. Default: `true` for single, `false` for multi. */
  blurInputOnSelect?: boolean
  menuPlacement?: 'top' | 'bottom' | 'auto'
  id?: string
  'aria-label'?: string
  'aria-labelledby'?: string
  name?: string
  tabIndex?: number
  formatOptionLabel?: (
    option: Option,
    meta: { context: 'menu' | 'value' },
  ) => ReactNode
  dropdownIcon?: ReactNode | ((state: { isOpen: boolean }) => ReactNode)
  /** Mark options as unselectable. Default: `(option) => !!option.isDisabled`. Disabled options are skipped by the keyboard. */
  isOptionDisabled?: (option: Option) => boolean
  /** Error state — danger-colored border + ring and `aria-invalid`. */
  isInvalid?: boolean
  /** Show a ✓ next to selected options in the menu. */
  showCheckmark?: boolean
  /** Visual style of the control. Default `'outline'`. */
  variant?: SelectVariant
  /** Control height, font size and option padding. Default `'md'`. */
  size?: SelectSize

  /** Offer a "Create …" option when the typed text matches nothing. */
  isCreatable?: boolean
  /** Called with the typed text when the create option is picked. If omitted, the new option is selected directly (with `__isNew__: true`). */
  onCreateOption?: (inputValue: string) => void
  /** Label of the create option. Default: `Create "text"`. */
  formatCreateLabel?: (inputValue: string) => ReactNode
  /** Decide when to offer the create option. Default: non-empty and no option/value with the same label. */
  isValidNewOption?: (
    inputValue: string,
    selectedValues: Option[],
    options: Option[],
  ) => boolean
  /** Shape of a newly created option. Default: `{ value: text, label: text }`. */
  getNewOptionData?: (inputValue: string) => Option

  /** Multi only: a "Select all / Clear all" row that toggles every visible, enabled option. */
  showSelectAll?: boolean
  /** Label of the select-all row. Default: "Select all" / "Clear all". */
  selectAllLabel?: ReactNode | ((state: { allSelected: boolean }) => ReactNode)
  /** Multi only: once this many are selected, the remaining options are disabled. */
  maxSelected?: number

  /** Underline + bold the part of each option label that matches the search. */
  highlightMatch?: boolean
  /** Render the menu into this element (e.g. `document.body`) so `overflow: hidden` parents and modals can't clip it. */
  menuPortalTarget?: HTMLElement | null
  /** Async only: wait this long after the last keystroke before calling `loadOptions`. */
  debounceMs?: number
}

export declare function Select<Option = SelectOption>(
  props: SelectProps<Option>,
): JSX.Element

export declare const SelectContext: Context<SelectContextValue | null>

export declare function useSelectContext<
  Option = SelectOption,
>(): SelectContextValue<Option>

export declare const defaultComponents: SelectComponents

/** Preset name → "r g b" triplet. */
export declare const colorPresets: Record<SelectColorPreset, string>

/** The `--rns-*` CSS variables for a set of color props — spread into any element's `style` to theme every Select inside it. */
export declare function getThemeVars(
  theme?: SelectThemeProps,
): CSSProperties & Record<`--rns-${string}`, string>

/** Preset name, hex, rgb() or hsl() → "r g b" (or null if unparseable). */
export declare function toRgbTriplet(color: string): string | null

export declare function mergeStyles(
  stylesProp: SelectStyles | undefined,
  key: string,
  baseStyle: CSSProperties,
  state: Record<string, unknown>,
): CSSProperties
