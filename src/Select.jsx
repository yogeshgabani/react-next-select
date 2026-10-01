import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import { SelectContext } from './SelectContext.jsx'
import { defaultComponents } from './defaultComponents.jsx'
import {
  filterOptions as applyFilter,
  flattenOptions,
} from './utils/filterOptions.js'
import { mergeStyles } from './utils/mergeStyles.js'
import { getThemeVars } from './utils/theme.js'
import { highlightText } from './utils/highlight.js'
import './styles/default.css'

// useLayoutEffect warns during SSR; it only matters once we're in the browser.
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

const defaultIsOptionDisabled = (o) => !!o?.isDisabled
const defaultFormatCreateLabel = (input) => `Create "${input}"`
const defaultGetNewOptionData = (input) => ({ value: input, label: input })
const defaultSelectAllLabel = ({ allSelected }) =>
  allSelected ? 'Clear all' : 'Select all'

// Theme tokens copied onto a portaled menu, which no longer sits inside the
// wrapper and so can't inherit them.
const PORTAL_VARS = [
  '--rns-accent',
  '--rns-bg',
  '--rns-menu-bg',
  '--rns-text',
  '--rns-muted',
  '--rns-placeholder',
  '--rns-option-hover',
  '--rns-option-selected',
  '--rns-option-padding',
  '--rns-radius',
  '--rns-font-size',
  '--rns-menu-max-height',
]

/** Index of the first enabled option walking from `from` by `step`, or -1. */
function findEnabledIndex(options, from, step, isOptionDisabled) {
  for (let i = from; i >= 0 && i < options.length; i += step) {
    if (!isOptionDisabled(options[i])) return i
  }
  return -1
}

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
    blurInputOnSelect,
    menuPlacement = 'bottom',
    id,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    name,
    tabIndex = 0,
    formatOptionLabel,
    isOptionDisabled = defaultIsOptionDisabled,
    isInvalid = false,
    showCheckmark = false,
    variant = 'outline',
    size = 'md',
    color,
    bgColor,
    borderColor,
    focusColor,
    textColor,
    placeholderColor,
    menuBgColor,
    optionHoverColor,
    optionSelectedColor,
    chipColor,
    radius,
    isCreatable = false,
    onCreateOption,
    formatCreateLabel = defaultFormatCreateLabel,
    isValidNewOption,
    getNewOptionData = defaultGetNewOptionData,
    showSelectAll = false,
    selectAllLabel = defaultSelectAllLabel,
    maxSelected,
    highlightMatch = false,
    menuPortalTarget,
    debounceMs = 0,
  } = props

  const resolvedCloseMenuOnSelect =
    closeMenuOnSelect !== undefined ? closeMenuOnSelect : !isMulti
  // Multi-select keeps focus after a pick so the keyboard keeps working.
  const resolvedBlurInputOnSelect =
    blurInputOnSelect !== undefined ? blurInputOnSelect : !isMulti

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
  const [autoPlacement, setAutoPlacement] = useState('bottom')
  const [portalStyle, setPortalStyle] = useState(null)

  const wrapperRef = useRef(null)
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

  const visibleOptions = isAsync ? asyncOptions : syncFilteredOptions
  // `displayOptions` is the flat, keyboard-navigable list; `menuTree` keeps groups.
  const { flat: displayOptions, tree: menuTree } = useMemo(
    () => flattenOptions(visibleOptions),
    [visibleOptions],
  )

  const selectedValues = useMemo(() => {
    if (isMulti) return Array.isArray(value) ? value : []
    return value ? [value] : []
  }, [isMulti, value])

  const atMax =
    isMulti && maxSelected != null && selectedValues.length >= maxSelected

  // Options that "Select all" acts on: visible, and not disabled by the user.
  const selectableVisible = useMemo(
    () => displayOptions.filter((o) => !isOptionDisabled(o)),
    [displayOptions, isOptionDisabled],
  )
  const allVisibleSelected =
    isMulti &&
    selectableVisible.length > 0 &&
    selectableVisible.every((o) => isOptionSelected(o, value, true, getOptionValue))

  const selectAllItem =
    isMulti && showSelectAll && selectableVisible.length > 0
      ? {
          __rnsSelectAll: true,
          value: '__rns_select_all__',
          label:
            typeof selectAllLabel === 'function'
              ? selectAllLabel({ allSelected: allVisibleSelected })
              : selectAllLabel,
        }
      : null

  const allKnownOptions = useMemo(
    () => (isAsync ? displayOptions : flattenOptions(optionsProp).flat),
    [isAsync, displayOptions, optionsProp],
  )

  const createItem = useMemo(() => {
    if (!isCreatable) return null
    const query = inputValue.trim().toLowerCase()
    if (!query) return null
    const valid = isValidNewOption
      ? isValidNewOption(inputValue, selectedValues, allKnownOptions)
      : ![...allKnownOptions, ...selectedValues].some(
          (o) => String(getOptionLabel(o) ?? '').trim().toLowerCase() === query,
        )
    return valid
      ? { ...getNewOptionData(inputValue.trim()), __rnsCreate: true }
      : null
  }, [
    isCreatable,
    inputValue,
    isValidNewOption,
    selectedValues,
    allKnownOptions,
    getOptionLabel,
    getNewOptionData,
  ])

  // Everything the keyboard moves through: [select all] + options + [create].
  const navOffset = selectAllItem ? 1 : 0
  const navOptions = useMemo(() => {
    const list = selectAllItem ? [selectAllItem, ...displayOptions] : [...displayOptions]
    if (createItem) list.push(createItem)
    return list
  }, [selectAllItem, displayOptions, createItem])

  // The option's own disabled flag, plus "limit reached" for anything that
  // isn't already selected.
  const isOptionUnavailable = useCallback(
    (o) => {
      if (o?.__rnsSelectAll) return atMax && !allVisibleSelected
      if (o?.__rnsCreate) return atMax
      if (isOptionDisabled(o)) return true
      return atMax && !isOptionSelected(o, value, isMulti, getOptionValue)
    },
    [atMax, allVisibleSelected, isOptionDisabled, value, isMulti, getOptionValue],
  )

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
    // Opening the menu or clearing the search loads right away; typing waits
    // for a pause of `debounceMs`.
    if (!(debounceMs > 0) || !inputValue) {
      runLoadOptions(inputValue)
      return
    }
    loadRequestRef.current++ // ignore responses for older input while we wait
    setAsyncLoading(true)
    const timer = setTimeout(() => runLoadOptions(inputValue), debounceMs)
    return () => clearTimeout(timer)
  }, [isAsync, isOpen, inputValue, runLoadOptions, debounceMs])

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
    // Land on the first enabled real option ("Select all" is reachable with
    // ArrowUp but shouldn't steal Enter). Keyed on length, not identity, so an
    // inline `options` array doesn't reset the highlight on every parent render.
    const first = findEnabledIndex(navOptions, navOffset, 1, isOptionUnavailable)
    setHighlightedIndex(
      first !== -1
        ? first
        : Math.max(0, findEnabledIndex(navOptions, 0, 1, isOptionUnavailable)),
    )
  }, [inputValue, navOptions.length, isOpen])

  const themeVars = useMemo(
    () =>
      getThemeVars({
        color,
        bgColor,
        borderColor,
        focusColor,
        textColor,
        placeholderColor,
        menuBgColor,
        optionHoverColor,
        optionSelectedColor,
        chipColor,
        radius,
      }),
    [
      color,
      bgColor,
      borderColor,
      focusColor,
      textColor,
      placeholderColor,
      menuBgColor,
      optionHoverColor,
      optionSelectedColor,
      chipColor,
      radius,
    ],
  )

  // Portaled menu: track the control's position and carry the theme tokens
  // across (the portal sits outside the wrapper, so nothing is inherited).
  useIsomorphicLayoutEffect(() => {
    if (!isOpen || !menuPortalTarget || !controlRef.current) {
      setPortalStyle(null)
      return
    }
    const tokens = {}
    if (wrapperRef.current) {
      const cs = getComputedStyle(wrapperRef.current)
      for (const name of PORTAL_VARS) {
        const v = cs.getPropertyValue(name).trim()
        if (v) tokens[name] = v
      }
      tokens.fontFamily = cs.fontFamily
    }
    let last = ''
    const update = () => {
      const r = controlRef.current?.getBoundingClientRect()
      if (!r) return
      const key = `${r.top}|${r.left}|${r.width}|${r.height}`
      if (key === last) return
      last = key
      setPortalStyle({ tokens, top: r.top, bottom: r.bottom, left: r.left, width: r.width })
    }
    update()
    window.addEventListener('scroll', update, true)
    window.addEventListener('resize', update)
    const ro =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : null
    ro?.observe(controlRef.current)
    return () => {
      window.removeEventListener('scroll', update, true)
      window.removeEventListener('resize', update)
      ro?.disconnect()
    }
  }, [isOpen, menuPortalTarget, themeVars, size])

  const portalReady = !!portalStyle

  useIsomorphicLayoutEffect(() => {
    if (!isOpen || menuPlacement !== 'auto' || !controlRef.current) return
    const rect = controlRef.current.getBoundingClientRect()
    const menuHeight = menuRef.current?.offsetHeight || 320
    const spaceBelow = window.innerHeight - rect.bottom
    const spaceAbove = rect.top
    setAutoPlacement(
      spaceBelow < menuHeight && spaceAbove > spaceBelow ? 'top' : 'bottom',
    )
  }, [isOpen, menuPlacement, portalReady])

  const placement = menuPlacement === 'auto' ? autoPlacement : menuPlacement

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
      if (!option || isDisabled || isOptionUnavailable(option)) return
      const same = (a, b) => getOptionValue(a) === getOptionValue(b)

      // "Select all" toggles the visible options and leaves the search alone.
      if (option.__rnsSelectAll) {
        if (allVisibleSelected) {
          const removed = selectedValues.filter((v) =>
            selectableVisible.some((o) => same(o, v)),
          )
          setValue(
            selectedValues.filter((v) => !removed.includes(v)),
            { action: 'deselect-all', removedValues: removed },
          )
        } else {
          let added = selectableVisible.filter(
            (o) => !selectedValues.some((v) => same(o, v)),
          )
          if (maxSelected != null) {
            added = added.slice(0, Math.max(0, maxSelected - selectedValues.length))
          }
          if (added.length) {
            setValue([...selectedValues, ...added], { action: 'select-all', options: added })
          }
        }
        return
      }

      if (option.__rnsCreate) {
        const { __rnsCreate, ...data } = option
        const created = { ...data, __isNew__: true }
        if (onCreateOption) {
          onCreateOption(inputValue.trim())
        } else {
          setValue(isMulti ? [...selectedValues, created] : created, {
            action: 'create-option',
            option: created,
          })
        }
      } else if (isMulti) {
        const exists = selectedValues.some((v) => same(v, option))
        const next = exists
          ? selectedValues.filter((v) => !same(v, option))
          : [...selectedValues, option]
        setValue(next, { action: exists ? 'remove-value' : 'select-option', option })
      } else {
        setValue(option, { action: 'select-option', option })
      }

      if (resolvedCloseMenuOnSelect) {
        closeMenu()
      } else {
        commitInput('', 'input-change')
      }
      if (resolvedBlurInputOnSelect && inputRef.current && typeof document !== 'undefined') {
        inputRef.current.blur()
      }
    },
    [
      isDisabled,
      isOptionUnavailable,
      allVisibleSelected,
      selectableVisible,
      selectedValues,
      maxSelected,
      onCreateOption,
      inputValue,
      isMulti,
      getOptionValue,
      setValue,
      resolvedCloseMenuOnSelect,
      closeMenu,
      commitInput,
      resolvedBlurInputOnSelect,
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
      const max = navOptions.length - 1
      // Disabled options are skipped; stay put when there's nothing further.
      const step = (from, dir, fallback) => {
        const next = findEnabledIndex(navOptions, from, dir, isOptionUnavailable)
        return next === -1 ? fallback : next
      }

      if (key === 'ArrowDown') {
        e.preventDefault()
        if (!isOpen) openMenu()
        else setHighlightedIndex((i) => step(i + 1, 1, i))
        return
      }
      if (key === 'ArrowUp') {
        e.preventDefault()
        if (!isOpen) openMenu()
        else setHighlightedIndex((i) => step(i - 1, -1, i))
        return
      }
      if (key === 'Home' && isOpen) {
        e.preventDefault()
        setHighlightedIndex(step(0, 1, 0))
        return
      }
      if (key === 'End' && isOpen) {
        e.preventDefault()
        setHighlightedIndex(step(max, -1, Math.max(max, 0)))
        return
      }
      if (key === 'Enter' && isOpen) {
        e.preventDefault()
        const opt = navOptions[highlightedIndex]
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
      isOptionUnavailable,
      navOptions,
      highlightedIndex,
      isOpen,
      openMenu,
      closeMenu,
      selectOption,
    ],
  )

  const containerStyle = mergeStyles(stylesProp, 'container', {}, { isDisabled })
  const controlStyle = mergeStyles(stylesProp, 'control', {}, { isDisabled, isFocused: isOpen })
  const menuStyle = mergeStyles(stylesProp, 'menu', {}, { placement })
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
  const GroupHeading = components.GroupHeading
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
    'aria-invalid': isInvalid || undefined,
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
    'aria-invalid': isInvalid || undefined,
    'aria-activedescendant': isOpen
      ? `${baseId}-opt-${highlightedIndex}`
      : undefined,
  }

  const rootClass = [
    'rns__wrapper',
    classNamePrefix && `${classNamePrefix}__wrapper`,
    variant && variant !== 'outline' && `rns--${variant}`,
    size && size !== 'md' && `rns--size-${size}`,
    isMulti && 'rns--is-multi',
    isDisabled && 'rns--is-disabled',
    isInvalid && 'rns--is-invalid',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const renderOption = (opt, index) => {
    const selected = opt.__rnsSelectAll
      ? allVisibleSelected
      : !opt.__rnsCreate && isOptionSelected(opt, value, isMulti, getOptionValue)
    const focused = index === highlightedIndex
    const disabled = isOptionUnavailable(opt)
    const optStyle = mergeStyles(
      stylesProp,
      'option',
      {},
      { isSelected: selected, isFocused: focused, isDisabled: disabled },
    )
    let label
    let key
    if (opt.__rnsSelectAll) {
      label = opt.label
      key = '__rns_select_all__'
    } else if (opt.__rnsCreate) {
      label = formatCreateLabel(inputValue.trim())
      key = '__rns_create__'
    } else {
      label = formatOptionLabel
        ? formatOptionLabel(opt, { context: 'menu' })
        : getOptionLabel(opt)
      if (highlightMatch && !formatOptionLabel) label = highlightText(label, inputValue)
      key = String(getOptionValue(opt))
    }
    return (
      <div key={key} style={optStyle} role="presentation">
        <Option
          data={opt}
          isSelected={selected}
          isFocused={focused}
          isDisabled={disabled}
          innerProps={{
            id: `${baseId}-opt-${index}`,
            role: 'option',
            'aria-selected': selected,
            'aria-disabled': disabled || undefined,
            onMouseMove: disabled ? undefined : () => setHighlightedIndex(index),
            onMouseDown: (e) => e.preventDefault(),
            onClick: () => selectOption(opt),
          }}
          selectProps={props}
        >
          {label}
        </Option>
      </div>
    )
  }

  const wrapMenu = (menu) => {
    if (!menu || !menuPortalTarget) return menu
    if (!portalStyle) return null // positioned in a layout effect, before paint
    // A zero-height anchor on the control's bottom edge (top edge when the
    // menu opens upward): the menu hangs off it exactly as it does inline,
    // and the anchor itself never covers anything clickable.
    const { tokens, top, bottom, left, width } = portalStyle
    const portalBoxStyle = mergeStyles(
      stylesProp,
      'menuPortal',
      {
        ...tokens,
        position: 'fixed',
        top: placement === 'top' ? top : bottom,
        left,
        width,
        height: 0,
        zIndex: 1000,
      },
      { placement },
    )
    return createPortal(
      <div className="rns__portal" style={portalBoxStyle}>
        {menu}
      </div>,
      menuPortalTarget,
    )
  }

  return (
    <SelectContext.Provider value={ctx}>
      <div
        ref={wrapperRef}
        className={rootClass}
        style={{ ...themeVars, ...containerStyle, ...style }}
      >
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

        {wrapMenu(isOpen && (
          <Menu
            innerProps={{
              ref: menuRef,
              id: listboxId,
              className: `rns__menu rns__menu--${placement}`,
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
                ) : navOptions.length === 0 ? (
                  <NoOptionsMessage selectProps={props}>
                    {noOptionsMessage({ inputValue })}
                  </NoOptionsMessage>
                ) : (
                  <>
                  {selectAllItem && renderOption(selectAllItem, 0)}
                  {menuTree.map((node) => {
                    if (node.type === 'option') {
                      return renderOption(node.option, node.index + navOffset)
                    }
                    const headingId = `${baseId}-group-${node.key}`
                    return (
                      <div
                        key={`group-${node.key}`}
                        className="rns__group"
                        role="group"
                        aria-labelledby={headingId}
                      >
                        <GroupHeading
                          data={node.group}
                          innerProps={{ id: headingId }}
                          selectProps={props}
                        >
                          {node.group.label}
                        </GroupHeading>
                        {node.children.map(({ option, index }) =>
                          renderOption(option, index + navOffset),
                        )}
                      </div>
                    )
                  })}
                  {createItem && renderOption(createItem, navOptions.length - 1)}
                  </>
                )}
              </MenuList>
            </div>
          </Menu>
        ))}

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
