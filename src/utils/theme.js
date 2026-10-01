/**
 * Named accent presets as space-separated RGB triplets (the format the
 * stylesheet's `--rns-accent` expects). Shades are picked so the full-opacity
 * accent — used for the focus border — keeps at least 3:1 contrast on both a
 * white and a slate-900 (#0f172a) surface.
 */
export const colorPresets = {
  slate: '100 116 139',
  gray: '107 114 128',
  red: '239 68 68',
  orange: '234 88 12',
  amber: '217 119 6',
  yellow: '190 128 4',
  lime: '101 163 13',
  green: '22 163 74',
  emerald: '5 150 105',
  teal: '13 148 136',
  cyan: '8 145 178',
  sky: '2 132 199',
  blue: '59 130 246',
  indigo: '99 102 241',
  violet: '139 92 246',
  purple: '168 85 247',
  fuchsia: '217 70 239',
  pink: '236 72 153',
  rose: '244 63 94',
}

const clamp255 = (n) => Math.max(0, Math.min(255, Math.round(n)))

function channel(token) {
  return token.endsWith('%') ? (parseFloat(token) / 100) * 255 : parseFloat(token)
}

function hslToRgb(h, s, l) {
  s /= 100
  l /= 100
  const k = (n) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  return [f(0) * 255, f(8) * 255, f(4) * 255]
}

/**
 * Convert a preset name, hex (#rgb, #rgba, #rrggbb, #rrggbbaa), rgb()/rgba(),
 * hsl()/hsla() or a raw "r g b" triplet into a "r g b" string.
 * Returns null for anything it can't parse (named CSS colors, var(), oklch...).
 * @param {string} color
 * @returns {string | null}
 */
export function toRgbTriplet(color) {
  if (color == null) return null
  const raw = String(color).trim().toLowerCase()
  if (colorPresets[raw]) return colorPresets[raw]

  let rgb = null

  const hex = raw.match(/^#([0-9a-f]{3,8})$/)
  if (hex) {
    let h = hex[1]
    if (h.length === 3 || h.length === 4) {
      h = h
        .slice(0, 3)
        .split('')
        .map((c) => c + c)
        .join('')
    }
    if (h.length === 6 || h.length === 8) {
      rgb = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16))
    }
  }

  const fn = !rgb && raw.match(/^(rgba?|hsla?)\(\s*([^)]+)\)$/)
  if (fn) {
    const parts = fn[2].split(/[\s,/]+/).filter(Boolean)
    if (parts.length >= 3) {
      if (fn[1].startsWith('rgb')) {
        rgb = parts.slice(0, 3).map(channel)
      } else {
        rgb = hslToRgb(parseFloat(parts[0]), parseFloat(parts[1]), parseFloat(parts[2]))
      }
    }
  }

  const triplet = !rgb && raw.match(/^(\d{1,3})\s+(\d{1,3})\s+(\d{1,3})$/)
  if (triplet) rgb = triplet.slice(1, 4).map(Number)

  if (!rgb || rgb.some((n) => Number.isNaN(n))) return null
  return rgb.map(clamp255).join(' ')
}

function rgbToHsl(r, g, b) {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return [0, 0, l * 100]
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h
  if (max === r) h = (g - b) / d + (g < b ? 6 : 0)
  else if (max === g) h = (b - r) / d + 2
  else h = (r - g) / d + 4
  return [h * 60, s * 100, l * 100]
}

const linear = (c) => {
  c /= 255
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}
const luminance = ([r, g, b]) => 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b)
const contrastWithWhite = (rgb) => 1.05 / (luminance(rgb) + 0.05)

/** Same saturation and lightness, hue turned by `deg` — the gradient variant's second stop. */
function rotateHue([r, g, b], deg) {
  const [h, s, l] = rgbToHsl(r, g, b)
  return hslToRgb((h + deg + 360) % 360, s, l).map(clamp255)
}

/** The accent, darkened just enough for white text to reach 4.5:1 — the solid variant's fill. */
function solidFill(rgb) {
  let c = rgb
  for (let i = 0; i < 20 && contrastWithWhite(c) < 4.5; i++) {
    c = c.map((v) => v * 0.94)
  }
  return c.map(clamp255)
}

const warned = new Set()
function warnOnce(message) {
  if (warned.has(message)) return
  warned.add(message)
  if (typeof console !== 'undefined') console.warn(`[react-next-select] ${message}`)
}

/**
 * Build the `--rns-*` CSS custom properties for a set of color props.
 * Spread the result into any element's `style` to theme every Select inside it.
 *
 * @param {object} [theme]
 * @returns {Record<string, string>}
 */
export function getThemeVars(theme = {}) {
  const {
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
  } = theme
  const vars = {}

  if (color != null && color !== '') {
    const rgb = toRgbTriplet(color)
    if (rgb) {
      const channels = rgb.split(' ').map(Number)
      vars['--rns-accent'] = rgb
      // A picked color also gives the control a soft tinted surface.
      vars['--rns-tint'] = '0.05'
      vars['--rns-accent-2'] = rotateHue(channels, 40).join(' ')
      vars['--rns-accent-solid'] = `rgb(${solidFill(channels).join(' ')})`
    } else {
      warnOnce(
        `Unsupported color "${color}". Use a preset (${Object.keys(colorPresets).join(', ')}), a hex, rgb() or hsl() value.`,
      )
    }
  }

  if (bgColor) {
    vars['--rns-bg'] = bgColor
    // An explicit background wins over the accent tint.
    vars['--rns-tint'] = '0'
  }
  if (borderColor) vars['--rns-control-border'] = borderColor
  if (focusColor) {
    const rgb = toRgbTriplet(focusColor)
    vars['--rns-focus-border'] = focusColor
    vars['--rns-focus-ring'] = rgb
      ? `rgb(${rgb} / 0.22)`
      : `color-mix(in srgb, ${focusColor} 22%, transparent)`
  }
  if (textColor) vars['--rns-text'] = textColor
  if (placeholderColor) vars['--rns-placeholder'] = placeholderColor
  if (menuBgColor) vars['--rns-menu-bg'] = menuBgColor
  if (optionHoverColor) vars['--rns-option-hover'] = optionHoverColor
  if (optionSelectedColor) vars['--rns-option-selected'] = optionSelectedColor
  if (chipColor) {
    vars['--rns-chip-bg'] = chipColor
    vars['--rns-chip-border'] = chipColor
  }
  if (radius != null && radius !== '') {
    vars['--rns-radius'] = typeof radius === 'number' ? `${radius}px` : String(radius)
  }

  return vars
}
