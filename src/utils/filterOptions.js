const defaultStringify = (option, getOptionLabel) => {
  const label = getOptionLabel(option)
  return String(label ?? '').toLowerCase()
}

/** A group is any item with an `options` array: `{ label, options: [...] }`. */
export function isGroup(item) {
  return !!item && Array.isArray(item.options)
}

/**
 * Filters options; groups keep only their matching children and are
 * dropped when none match.
 * @param {object[]} options
 * @param {string} inputValue
 * @param {(option: object, input: string) => boolean} [filterOption]
 * @param {(option: object) => string} getOptionLabel
 */
export function filterOptions(options, inputValue, filterOption, getOptionLabel) {
  if (!inputValue) return options
  const q = inputValue.trim().toLowerCase()
  if (!q) return options

  const matches =
    typeof filterOption === 'function'
      ? (o) => filterOption(o, inputValue)
      : (o) => defaultStringify(o, getOptionLabel).includes(q)

  const result = []
  for (const item of options) {
    if (isGroup(item)) {
      const children = item.options.filter(matches)
      if (children.length) result.push({ ...item, options: children })
    } else if (matches(item)) {
      result.push(item)
    }
  }
  return result
}

/**
 * Splits a (possibly grouped) option list into a flat list of selectable
 * options — what keyboard navigation indexes into — and a render tree
 * that keeps group boundaries.
 * @param {object[]} options
 */
export function flattenOptions(options) {
  const flat = []
  const tree = []
  options.forEach((item, groupIndex) => {
    if (isGroup(item)) {
      const children = item.options.map((option) => {
        flat.push(option)
        return { option, index: flat.length - 1 }
      })
      tree.push({ type: 'group', group: item, key: groupIndex, children })
    } else {
      flat.push(item)
      tree.push({ type: 'option', option: item, index: flat.length - 1 })
    }
  })
  return { flat, tree }
}
