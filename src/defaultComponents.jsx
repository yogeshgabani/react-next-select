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

export function DefaultDropdownIndicator(props) {
  const { innerProps } = props
  const ctx = useSelectContext()
  return (
    <button
      type="button"
      className="rns__indicator rns__dropdown-indicator"
      aria-hidden
      tabIndex={-1}
      {...innerProps}
    >
      <span className="rns__dropdown-chevron" aria-hidden>
        {ctx.isOpen ? '▲' : '▼'}
      </span>
    </button>
  )
}

export function DefaultClearIndicator(props) {
  const { innerProps } = props
  return (
    <button
      type="button"
      className="rns__indicator rns__clear-indicator"
      aria-label="Clear value"
      {...innerProps}
    >
      ×
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

export function DefaultOption(props) {
  const { innerProps, children, data } = props
  return (
    <div className="rns__option" role="option" {...innerProps}>
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
  const { children, data } = props
  return <div className="rns__single-value">{children ?? data?.label}</div>
}

export function DefaultMultiValue(props) {
  const { children, data, removeProps } = props
  return (
    <div className="rns__multi-value">
      <span className="rns__multi-value__label">{children ?? data?.label}</span>
      <button type="button" className="rns__multi-value__remove" {...removeProps}>
        ×
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
  LoadingMessage: DefaultLoadingMessage,
  NoOptionsMessage: DefaultNoOptionsMessage,
  SingleValue: DefaultSingleValue,
  MultiValue: DefaultMultiValue,
}
