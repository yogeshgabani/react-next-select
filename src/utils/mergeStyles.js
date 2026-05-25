/**
 * @param {Record<string, (base: object, state: object) => object | object>} stylesProp
 * @param {string} key
 * @param {object} baseStyle
 * @param {object} state
 */
export function mergeStyles(stylesProp, key, baseStyle, state) {
  const custom = stylesProp?.[key]
  if (typeof custom === 'function') {
    return custom(baseStyle, state) || baseStyle
  }
  if (custom && typeof custom === 'object') {
    return { ...baseStyle, ...custom }
  }
  return baseStyle
}
