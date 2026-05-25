const defaultStringify = (option, getOptionLabel) => {
  const label = getOptionLabel(option)
  return String(label ?? '').toLowerCase()
}

/**
 * @param {object[]} options
 * @param {string} inputValue
 * @param {(option: object, input: string) => boolean} [filterOption]
 * @param {(option: object) => string} getOptionLabel
 */
export function filterOptions(options, inputValue, filterOption, getOptionLabel) {
  if (!inputValue) return options
  const q = inputValue.trim().toLowerCase()
  if (!q) return options

  if (typeof filterOption === 'function') {
    return options.filter((o) => filterOption(o, inputValue))
  }

  return options.filter((o) => defaultStringify(o, getOptionLabel).includes(q))
}
