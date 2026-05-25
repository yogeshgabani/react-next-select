import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import { SelectContext } from './SelectContext.jsx'
import { defaultComponents } from './defaultComponents.jsx'
import { filterOptions as applyFilter } from './utils/filterOptions.js'
import { mergeStyles } from './utils/mergeStyles.js'
import './styles/default.css'

function shallowEqualOptions(a, b, getOptionValue) {
  if (a === b) return true
  if (!a || !b) return false
  return getOptionValue(a) === getOptionValue(b)
}

function isOptionSelected(option, value, isMulti, getOptionValue) {
  if (!option) return false
  if (isMulti && Array.isArray(value)) {
    return value.some((v) => getOptionValue(v) === getOptionValue(option))
  }
  return shallowEqualOptions(option, value, getOptionValue)
}

function mergeComponentMap(user = {}) {
  return { ...defaultComponents, ...user }
}

/**
 * @param {object} props
 */
export function Select(props) {
  const {
    options: optionsProp = [],
    value: valueProp,
    defaultValue,
    onChange,
    isMulti = false,
    isSearchable = true,
    showMenuSearchInput = false,
    menuSearchPlaceholder = 'Search...',
    menuSearchInputProps = {},
    isClearable = false,
    isDisabled = false,
    isLoading: isLoadingProp = false,
    loadOptions,
    defaultOptions = false,
    filterOption,
    getOptionValue = (o) => o?.value,
    getOptionLabel = (o) => o?.label,
    placeholder = 'Select...',
    noOptionsMessage = () => 'No options',
    loadingMessage = () => 'Loading...',
    components: componentsProp,
    className,
    classNamePrefix = 'rns',
    style,
    styles: stylesProp = {},
    inputValue: inputValueProp,
    defaultInputValue = '',
    onInputChange,
    onMenuOpen,
    onMenuClose,
    menuIsOpen: menuIsOpenProp,
    closeMenuOnSelect,
    blurInputOnSelect = true,
    menuPlacement = 'bottom',
    id,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    name,
    tabIndex = 0,
    formatOptionLabel,
  } = props

  const resolvedCloseMenuOnSelect =
    closeMenuOnSelect !== undefined ? closeMenuOnSelect : !isMulti

  const autoId = useId()
  const baseId = id ?? `rns-${autoId.replace(/:/g, '')}`
  const listboxId = `${baseId}-listbox`

  const isValueControlled = valueProp !== undefined
  const isInputControlled = inputValueProp !== undefined
  const isMenuControlled = menuIsOpenProp !== undefined

  const [uncontrolledValue, setUncontrolledValue] = useState(
    defaultValue ?? (isMulti ? [] : null),
  )
  const value = isValueControlled ? valueProp : uncontrolledValue

  const [internalInput, setInternalInput] = useState(defaultInputValue)
  const inputValue = isInputControlled ? inputValueProp : internalInput

  const [internalMenuOpen, setInternalMenuOpen] = useState(false)
  const isOpen = isMenuControlled ? !!menuIsOpenProp : internalMenuOpen

  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const [asyncOptions, setAsyncOptions] = useState([])
  const [asyncLoading, setAsyncLoading] = useState(false)
  const [menuSearchFocused, setMenuSearchFocused] = useState(false)

  const controlRef = useRef(null)
  const inputRef = useRef(null)
  const menuRef = useRef(null)
  const menuSearchInputRef = useRef(null)
  const loadRequestRef = useRef(0)

  const components = useMemo(
    () => mergeComponentMap(componentsProp),
    [componentsProp],
  )

  const isAsync = typeof loadOptions === 'function'
  const isLoading = isLoadingProp || asyncLoading

  const syncFilteredOptions = useMemo(() => {
    if (isAsync) return []
    return applyFilter(optionsProp, inputValue, filterOption, getOptionLabel)
  }, [isAsync, optionsProp, inputValue, filterOption, getOptionLabel])

  const displayOptions = isAsync ? asyncOptions : syncFilteredOptions

  const selectedValues = useMemo(() => {
    if (isMulti) return Array.isArray(value) ? value : []
    return value ? [value] : []
  }, [isMulti, value])

  const setValue = useCallback(
    (next, meta) => {
      if (!isValueControlled) {
        setUncontrolledValue(next)
      }
      onChange?.(next, meta)
    },
    [isValueControlled, onChange],
  )

  const setMenuOpen = useCallback(
    (open) => {
      if (isDisabled) return
      if (!isMenuControlled) {
        setInternalMenuOpen(open)
      }
      if (open) onMenuOpen?.()
      else onMenuClose?.()
    },
    [isDisabled, isMenuControlled, onMenuOpen, onMenuClose],
  )

  const commitInput = useCallback(
    (next, action) => {
      if (!isInputControlled) {
        setInternalInput(next)
      }
      onInputChange?.(next, { action, prevInputValue: inputValue })
    },
    [isInputControlled, onInputChange, inputValue],
  )

  const openMenu = useCallback(() => {
    if (!isOpen) setMenuOpen(true)
  }, [isOpen, setMenuOpen])

  const closeMenu = useCallback(() => {
    if (isOpen) {
      setMenuOpen(false)
      commitInput('', 'menu-close')
      setHighlightedIndex(0)
    }
  }, [isOpen, setMenuOpen, commitInput])

  const runLoadOptions = useCallback(
    (search) => {
      if (!loadOptions) return
      const req = ++loadRequestRef.current
      setAsyncLoading(true)
      Promise.resolve(loadOptions(search))
        .then((loaded) => {
          if (req !== loadRequestRef.current) return
          setAsyncOptions(Array.isArray(loaded) ? loaded : [])
        })
        .catch(() => {
          if (req !== loadRequestRef.current) return
          setAsyncOptions([])
        })
        .finally(() => {
          if (req !== loadRequestRef.current) return
          setAsyncLoading(false)
        })
    },
    [loadOptions],
  )

  useEffect(() => {
    if (!isAsync) return
    if (defaultOptions === true) {
      runLoadOptions('')
    } else if (Array.isArray(defaultOptions)) {
      setAsyncOptions(defaultOptions)
    }
  }, [isAsync, defaultOptions, runLoadOptions])

  useEffect(() => {
    if (!isAsync || !isOpen) return
    runLoadOptions(inputValue)
  }, [isAsync, isOpen, inputValue, runLoadOptions])

  useEffect(() => {
    if (typeof document === 'undefined') return
    if (!isOpen) return
    const onPointerDown = (e) => {
      const t = e.target
      if (controlRef.current?.contains(t)) return
      if (menuRef.current?.contains(t)) return
      closeMenu()
    }
    document.addEventListener('pointerdown', onPointerDown, true)
    return () => document.removeEventListener('pointerdown', onPointerDown, true)
  }, [isOpen, closeMenu])

  useEffect(() => {
    setHighlightedIndex(0)
  }, [inputValue, displayOptions.length, isOpen])

  useEffect(() => {
    if (!isOpen || !isSearchable || typeof document === 'undefined') return
    if (showMenuSearchInput && menuSearchInputRef.current) {
      menuSearchInputRef.current.focus()
      return
    }
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen, isSearchable, showMenuSearchInput])

  const selectOption = useCallback(
    (option) => {
      if (!option || isDisabled) return
      if (isMulti) {
        const current = Array.isArray(value) ? value : []
        const exists = current.some(
          (v) => getOptionValue(v) === getOptionValue(option),
        )
        const next = exists
          ? current.filter((v) => getOptionValue(v) !== getOptionValue(option))
          : [...current, option]
        setValue(next, { action: exists ? 'remove-value' : 'select-option', option })
      } else {
        setValue(option, { action: 'select-option', option })
      }
      if (resolvedCloseMenuOnSelect) {
        closeMenu()
      } else {
        commitInput('', 'input-change')
      }
      if (blurInputOnSelect && inputRef.current && typeof document !== 'undefined') {
        inputRef.current.blur()
      }
    },
    [
      isDisabled,
      isMulti,
      value,
      getOptionValue,
      setValue,
      resolvedCloseMenuOnSelect,
      closeMenu,
      commitInput,
      blurInputOnSelect,
    ],
  )

  const clearValue = useCallback(
    (e) => {
      e?.preventDefault?.()
      e?.stopPropagation?.()
      const prev = value
      const next = isMulti ? [] : null
      setValue(next, { action: 'clear', removedValues: isMulti ? prev : prev ? [prev] : [] })
      commitInput('', 'clear')
    },
    [isMulti, value, setValue, commitInput],
  )

  const onKeyDown = useCallback(
    (e) => {
      if (isDisabled) return
      const { key } = e
      const max = displayOptions.length - 1

      if (key === 'ArrowDown') {
        e.preventDefault()
        if (!isOpen) openMenu()
        else setHighlightedIndex((i) => (max < 0 ? 0 : Math.min(i + 1, max)))
        return
      }
      if (key === 'ArrowUp') {
        e.preventDefault()
        if (!isOpen) openMenu()
        else setHighlightedIndex((i) => (max < 0 ? 0 : Math.max(i - 1, 0)))
        return
      }
      if (key === 'Home' && isOpen) {
        e.preventDefault()
        setHighlightedIndex(0)
        return
      }
      if (key === 'End' && isOpen) {
        e.preventDefault()
        setHighlightedIndex(max < 0 ? 0 : max)
        return
      }
      if (key === 'Enter' && isOpen) {
        e.preventDefault()
        const opt = displayOptions[highlightedIndex]
        if (opt) selectOption(opt)
        return
      }
      if (key === 'Escape' && isOpen) {
        e.preventDefault()
        closeMenu()
        return
      }
      if (key === 'Tab' && isOpen) {
        closeMenu()
      }
    },
    [
      isDisabled,
      displayOptions,
      highlightedIndex,
      isOpen,
      openMenu,
      closeMenu,
      selectOption,
    ],
  )

  const containerStyle = mergeStyles(stylesProp, 'container', {}, { isDisabled })
  const controlStyle = mergeStyles(stylesProp, 'control', {}, { isDisabled, isFocused: isOpen })
  const menuStyle = mergeStyles(
    stylesProp,
    'menu',
    {},
    { placement: menuPlacement },
  )
  const menuSearchWrapStyle = mergeStyles(
    stylesProp,
    'menuSearchWrap',
    {},
    { isDisabled, inputValue },
  )
  const menuSearchInputWrapStyle = mergeStyles(
    stylesProp,
    'menuSearchInputWrap',
    {},
    { isDisabled, inputValue, isFocused: menuSearchFocused },
  )
  const menuSearchInputStyle = mergeStyles(
    stylesProp,
    'menuSearchInput',
    {},
    { isDisabled, inputValue, isFocused: menuSearchFocused },
  )
  const menuSearchIconStyle = mergeStyles(
    stylesProp,
    'menuSearchIcon',
    {},
    { isDisabled, inputValue, isFocused: menuSearchFocused },
  )
  const menuSearchClearStyle = mergeStyles(
    stylesProp,
    'menuSearchClear',
    {},
    { isDisabled, hasValue: !!inputValue },
  )

  const ctx = useMemo(
    () => ({
      isOpen,
      isDisabled,
      isMulti,
      isSearchable,
      inputValue,
      highlightedIndex,
      displayOptions,
      value,
      getOptionValue,
      getOptionLabel,
      classNamePrefix,
    }),
    [
      isOpen,
      isDisabled,
      isMulti,
      isSearchable,
      inputValue,
      highlightedIndex,
      displayOptions,
      value,
      getOptionValue,
      getOptionLabel,
      classNamePrefix,
    ],
  )

  const Control = components.Control
  const ValueContainer = components.ValueContainer
  const IndicatorsContainer = components.IndicatorsContainer
  const DropdownIndicator = components.DropdownIndicator
  const ClearIndicator = components.ClearIndicator
  const Input = components.Input
  const Menu = components.Menu
  const MenuList = components.MenuList
  const Option = components.Option
  const LoadingMessage = components.LoadingMessage
  const NoOptionsMessage = components.NoOptionsMessage
  const SingleValue = components.SingleValue
  const MultiValue = components.MultiValue

  const showClear =
    isClearable &&
    !isDisabled &&
    (isMulti ? selectedValues.length > 0 : value != null)

  const controlInnerProps = {
    onKeyDown,
    onMouseDown: (e) => {
      if (isDisabled) return
      e.preventDefault()
      if (isOpen) closeMenu()
      else openMenu()
    },
    role: 'combobox',
    'aria-expanded': isOpen,
    'aria-controls': listboxId,
    'aria-haspopup': 'listbox',
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    tabIndex: isSearchable && !showMenuSearchInput ? -1 : tabIndex,
  }

  const inputInnerProps = {
    ref: inputRef,
    id: `${baseId}-input`,
    disabled: isDisabled,
    readOnly: !isSearchable || showMenuSearchInput,
    value: isSearchable && !showMenuSearchInput ? inputValue : '',
    placeholder:
      (!isMulti && value) || (isMulti && selectedValues.length > 0)
        ? ''
        : placeholder,
    onChange: (e) => {
      if (!isSearchable || isDisabled) return
      const v = e.target.value
      commitInput(v, 'input-change')
      if (!isOpen) openMenu()
    },
    onFocus: () => openMenu(),
    onKeyDown: (e) => {
      if (e.key === 'Backspace' && isMulti && !inputValue && selectedValues.length) {
        const next = selectedValues.slice(0, -1)
        setValue(next, {
          action: 'remove-value',
          removedValue: selectedValues[selectedValues.length - 1],
        })
      }
    },
    autoComplete: 'off',
    autoCorrect: 'off',
    spellCheck: false,
    'aria-autocomplete': 'list',
    'aria-controls': listboxId,
    'aria-activedescendant': isOpen
      ? `${baseId}-opt-${highlightedIndex}`
      : undefined,
  }

  const rootClass = [
    'rns__wrapper',
    classNamePrefix && `${classNamePrefix}__wrapper`,
    isDisabled && 'rns--is-disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <SelectContext.Provider value={ctx}>
      <div className={rootClass} style={{ ...containerStyle, ...style }}>
        <Control
          ref={controlRef}
          innerProps={controlInnerProps}
          selectProps={props}
          isDisabled={isDisabled}
          isFocused={isOpen}
          style={controlStyle}
        >
            <ValueContainer
              innerProps={{}}
              selectProps={props}
              isDisabled={isDisabled}
            >
              {isMulti &&
                selectedValues.map((v, i) => {
                  const mvStyle = mergeStyles(stylesProp, 'multiValue', {}, {})
                  return (
                    <span key={`${getOptionValue(v)}-${i}`} style={mvStyle}>
                      <MultiValue
                        data={v}
                        selectProps={props}
                        removeProps={{
                          onMouseDown: (e) => e.stopPropagation(),
                          onClick: (e) => {
                            e.stopPropagation()
                            const next = selectedValues.filter(
                              (_, j) => j !== i,
                            )
                            setValue(next, { action: 'remove-value', removedValue: v })
                          },
                        }}
                      >
                        {formatOptionLabel
                          ? formatOptionLabel(v, { context: 'value' })
                          : getOptionLabel(v)}
                      </MultiValue>
                    </span>
                  )
                })}
              {!isMulti && value && (
                <SingleValue data={value} selectProps={props}>
                  {formatOptionLabel
                    ? formatOptionLabel(value, { context: 'value' })
                    : getOptionLabel(value)}
                </SingleValue>
              )}
              <Input innerProps={inputInnerProps} selectProps={props} />
            </ValueContainer>
            <IndicatorsContainer innerProps={{}} selectProps={props}>
              {showClear && (
                <ClearIndicator
                  innerProps={{
                    onMouseDown: (e) => e.stopPropagation(),
                    onClick: clearValue,
                  }}
                  selectProps={props}
                />
              )}
              <DropdownIndicator
                innerProps={{
                  onMouseDown: (e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  },
                  onClick: (e) => {
                    e.stopPropagation()
                    if (isOpen) closeMenu()
                    else openMenu()
                  },
                }}
                selectProps={props}
              />
            </IndicatorsContainer>
        </Control>

        {isOpen && (
          <Menu
            innerProps={{
              ref: menuRef,
              id: listboxId,
              className: `rns__menu rns__menu--${menuPlacement}`,
            }}
            selectProps={props}
          >
            <div
              style={menuStyle}
              className={`${classNamePrefix}__menu-inner`}
            >
              {isSearchable && showMenuSearchInput && (
                <div className="rns__menu-search-wrap" style={menuSearchWrapStyle}>
                  <div
                    className="rns__menu-search-input-wrap"
                    style={menuSearchInputWrapStyle}
                  >
                    <input
                      ref={menuSearchInputRef}
                      className="rns__menu-search-input"
                      style={menuSearchInputStyle}
                      value={inputValue}
                      placeholder={menuSearchPlaceholder}
                      onChange={(e) => commitInput(e.target.value, 'input-change')}
                      onFocus={() => setMenuSearchFocused(true)}
                      onBlur={() => setMenuSearchFocused(false)}
                      onKeyDown={onKeyDown}
                      {...menuSearchInputProps}
                    />
                    {!!inputValue && (
                      <button
                        type="button"
                        className="rns__menu-search-clear"
                        style={menuSearchClearStyle}
                        aria-label="Clear search"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => commitInput('', 'clear')}
                      >
                        ×
                      </button>
                    )}
                    <span
                      className="rns__menu-search-icon"
                      style={menuSearchIconStyle}
                      aria-hidden
                    >
                      <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
                        <path d="M13.5 12h-.79l-.28-.27A5.49 5.49 0 0 0 13.75 8a5.5 5.5 0 1 0-5.5 5.5 5.49 5.49 0 0 0 3.73-1.32l.27.28v.79l5 4.99L18.49 17l-4.99-5zM8.25 12A4 4 0 1 1 8.25 4a4 4 0 0 1 0 8z" />
                      </svg>
                    </span>
                  </div>
                </div>
              )}
              <MenuList innerProps={{}} selectProps={props}>
                {isLoading ? (
                  <LoadingMessage selectProps={props}>
                    {loadingMessage({ inputValue })}
                  </LoadingMessage>
                ) : displayOptions.length === 0 ? (
                  <NoOptionsMessage selectProps={props}>
                    {noOptionsMessage({ inputValue })}
                  </NoOptionsMessage>
                ) : (
                  displayOptions.map((opt, index) => {
                    const selected = isOptionSelected(
                      opt,
                      value,
                      isMulti,
                      getOptionValue,
                    )
                    const focused = index === highlightedIndex
                    const optStyle = mergeStyles(
                      stylesProp,
                      'option',
                      {},
                      { isSelected: selected, isFocused: focused },
                    )
                    const label = formatOptionLabel
                      ? formatOptionLabel(opt, { context: 'menu' })
                      : getOptionLabel(opt)
                    return (
                      <div
                        key={String(getOptionValue(opt))}
                        style={optStyle}
                        role="presentation"
                      >
                        <Option
                          data={opt}
                          isSelected={selected}
                          isFocused={focused}
                          innerProps={{
                            id: `${baseId}-opt-${index}`,
                            role: 'option',
                            'aria-selected': selected,
                            onMouseMove: () => setHighlightedIndex(index),
                            onMouseDown: (e) => e.preventDefault(),
                            onClick: () => selectOption(opt),
                          }}
                          selectProps={props}
                        >
                          {label}
                        </Option>
                      </div>
                    )
                  })
                )}
              </MenuList>
            </div>
          </Menu>
        )}

        {name && (
          <input type="hidden" name={name} value={serializeForForm(value, isMulti, getOptionValue)} />
        )}
      </div>
    </SelectContext.Provider>
  )
}

function serializeForForm(value, isMulti, getOptionValue) {
  if (isMulti) {
    if (!Array.isArray(value) || value.length === 0) return ''
    return value.map((v) => getOptionValue(v)).join(',')
  }
  if (!value) return ''
  return String(getOptionValue(value))
}
