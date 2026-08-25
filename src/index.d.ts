import type { ComponentType, Context, CSSProperties, ReactNode } from 'react'

/** A single selectable item. Shape is up to you — override `getOptionValue`/`getOptionLabel` for custom shapes. */
export interface SelectOption {
  value: unknown
  label: ReactNode
  [key: string]: unknown
}

export type SelectValue<Option> = Option | Option[] | null | undefined

export interface OnChangeMeta<Option> {
  action:
    | 'select-option'
    | 'remove-value'
    | 'clear'
    | 'input-change'
    | 'menu-close'
  option?: Option
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
  [key: string]: CSSProperties | StyleFn | undefined
}

export interface SelectProps<Option = SelectOption> {
  options?: Option[]
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
  loadOptions?: (inputValue: string) => Promise<Option[]> | Option[]
  defaultOptions?: boolean | Option[]
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
}

export declare function Select<Option = SelectOption>(
  props: SelectProps<Option>,
): JSX.Element

export declare const SelectContext: Context<SelectContextValue | null>

export declare function useSelectContext<
  Option = SelectOption,
>(): SelectContextValue<Option>

export declare const defaultComponents: SelectComponents

export declare function mergeStyles(
  stylesProp: SelectStyles | undefined,
  key: string,
  baseStyle: CSSProperties,
  state: Record<string, unknown>,
): CSSProperties
