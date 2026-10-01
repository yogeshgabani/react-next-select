import { forwardRef } from 'react'
import { useSelectContext } from './SelectContext.jsx'

export const DefaultControl = forwardRef(function DefaultControl(props, ref) {
  const { innerProps, children, style } = props
  return (
    <div ref={ref} className="rns__control" style={style} {...innerProps}>
      {children}
    </div>
  )
})

export function DefaultValueContainer(props) {
  const { innerProps, children } = props
  return (
    <div className="rns__value-container" {...innerProps}>
      {children}
    </div>
  )
}

export function DefaultIndicatorsContainer(props) {
  const { innerProps, children } = props
  return (
    <div className="rns__indicators" {...innerProps}>
      {children}
    </div>
  )
}

const DefaultChevron = (
  <svg
    viewBox="0 0 20 20"
    width="14"
    height="14"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M5 7.5l5 5 5-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export function DefaultDropdownIndicator(props) {
  const { innerProps, selectProps } = props
  const ctx = useSelectContext()
  const customIcon = selectProps?.dropdownIcon
  const icon =
    customIcon === undefined || customIcon === null
      ? DefaultChevron
      : typeof customIcon === 'function'
        ? customIcon({ isOpen: ctx.isOpen })
        : customIcon
  const className =
    'rns__indicator rns__dropdown-indicator' +
    (ctx.isOpen ? ' rns__dropdown-indicator--open' : '')
  return (
    <button
      type="button"
      className={className}
      aria-hidden
      tabIndex={-1}
      {...innerProps}
    >
      <span className="rns__dropdown-chevron" aria-hidden="true">
        {icon}
      </span>
    </button>
  )
}

const DefaultClearIcon = (
  <svg
    viewBox="0 0 20 20"
    width="14"
    height="14"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M6 6l8 8M14 6l-8 8"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
)

export function DefaultClearIndicator(props) {
  const { innerProps } = props
  return (
    <button
      type="button"
      className="rns__indicator rns__clear-indicator"
      aria-label="Clear value"
      {...innerProps}
    >
      <span className="rns__clear-icon" aria-hidden="true">
        {DefaultClearIcon}
      </span>
    </button>
  )
}

export const DefaultInput = forwardRef(function DefaultInput(props, ref) {
  const { innerProps } = props
  return <input ref={ref} className="rns__input" {...innerProps} />
})

export function DefaultMenu(props) {
  const { innerProps = {}, children } = props
  const { ref: menuRef, className, ...rest } = innerProps
  return (
    <div
      ref={menuRef}
      className={className ?? 'rns__menu'}
      {...rest}
    >
      {children}
    </div>
  )
}

export function DefaultMenuList(props) {
  const { innerProps, children } = props
  return (
    <div className="rns__menu-list" role="listbox" {...innerProps}>
      {children}
    </div>
  )
}

const CheckIcon = (
  <svg
    viewBox="0 0 20 20"
    width="14"
    height="14"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M4.5 10.5l3.5 3.5 7.5-8"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const PlusIcon = (
  <svg
    viewBox="0 0 20 20"
    width="14"
    height="14"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M10 4.5v11M4.5 10h11"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
  </svg>
)

/**
 * `icon` / `description` on an option are rendered automatically unless
 * `formatOptionLabel` takes over the rendering.
 */
function richParts(data, selectProps) {
  if (!data || selectProps?.formatOptionLabel) return {}
  return { icon: data.icon, description: data.description }
}

export function DefaultOption(props) {
  const { innerProps, children, data, isSelected, isFocused, isDisabled, selectProps } =
    props
  const withCheck = !!selectProps?.showCheckmark
  const isCreate = !!data?.__rnsCreate
  const isSelectAll = !!data?.__rnsSelectAll
  const { icon, description } = richParts(data, selectProps)
  const leading = isCreate ? PlusIcon : icon
  const rich = withCheck || leading != null || description != null
  const className = [
    'rns__option',
    isFocused && 'rns__option--focused',
    isSelected && 'rns__option--selected',
    isDisabled && 'rns__option--disabled',
    isCreate && 'rns__option--create',
    isSelectAll && 'rns__option--select-all',
    rich && 'rns__option--rich',
  ]
    .filter(Boolean)
    .join(' ')
  const content = children ?? data?.label
  return (
    <div className={className} role="option" {...innerProps}>
      {rich ? (
        <>
          {leading != null && <span className="rns__option-icon">{leading}</span>}
          <span className="rns__option-content">
            <span className="rns__option-label">{content}</span>
            {description != null && (
              <span className="rns__option-description">{description}</span>
            )}
          </span>
          {withCheck && isSelected && (
            <span className="rns__option-check">{CheckIcon}</span>
          )}
        </>
      ) : (
        content
      )}
    </div>
  )
}

export function DefaultGroupHeading(props) {
  const { innerProps, children, data } = props
  return (
    <div className="rns__group-heading" {...innerProps}>
      {children ?? data?.label}
    </div>
  )
}

export function DefaultLoadingMessage(props) {
  const { children } = props
  return <div className="rns__loading-message">{children ?? 'Loading...'}</div>
}

export function DefaultNoOptionsMessage(props) {
  const { children } = props
  return <div className="rns__no-options">{children ?? 'No options'}</div>
}

export function DefaultSingleValue(props) {
  const { children, data, selectProps } = props
  const { icon } = richParts(data, selectProps)
  const content = children ?? data?.label
  if (icon == null) return <div className="rns__single-value">{content}</div>
  return (
    <div className="rns__single-value rns__single-value--with-icon">
      <span className="rns__value-icon">{icon}</span>
      <span className="rns__single-value-label">{content}</span>
    </div>
  )
}

const MultiValueRemoveIcon = (
  <svg
    viewBox="0 0 20 20"
    width="12"
    height="12"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M6 6l8 8M14 6l-8 8"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
  </svg>
)

export function DefaultMultiValue(props) {
  const { children, data, removeProps, selectProps } = props
  const { icon } = richParts(data, selectProps)
  return (
    <div className="rns__multi-value">
      <span className="rns__multi-value__label">
        {icon != null && <span className="rns__value-icon">{icon}</span>}
        {children ?? data?.label}
      </span>
      <button
        type="button"
        className="rns__multi-value__remove"
        aria-label="Remove"
        {...removeProps}
      >
        <span className="rns__multi-value__remove-icon" aria-hidden="true">
          {MultiValueRemoveIcon}
        </span>
      </button>
    </div>
  )
}

export const defaultComponents = {
  Control: DefaultControl,
  ValueContainer: DefaultValueContainer,
  IndicatorsContainer: DefaultIndicatorsContainer,
  DropdownIndicator: DefaultDropdownIndicator,
  ClearIndicator: DefaultClearIndicator,
  Input: DefaultInput,
  Menu: DefaultMenu,
  MenuList: DefaultMenuList,
  Option: DefaultOption,
  GroupHeading: DefaultGroupHeading,
  LoadingMessage: DefaultLoadingMessage,
  NoOptionsMessage: DefaultNoOptionsMessage,
  SingleValue: DefaultSingleValue,
  MultiValue: DefaultMultiValue,
}
