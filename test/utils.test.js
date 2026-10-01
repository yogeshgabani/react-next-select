import { describe, expect, it, vi } from 'vitest'
import { colorPresets, getThemeVars, toRgbTriplet } from '../src/utils/theme.js'
import { filterOptions, flattenOptions } from '../src/utils/filterOptions.js'

describe('toRgbTriplet', () => {
  it.each([
    ['purple', '168 85 247'],
    ['  PURPLE ', '168 85 247'],
    ['#a855f7', '168 85 247'],
    ['#A855F7', '168 85 247'],
    ['#fff', '255 255 255'],
    ['#ffff', '255 255 255'],
    ['#a855f780', '168 85 247'],
    ['rgb(168, 85, 247)', '168 85 247'],
    ['rgba(168,85,247,0.5)', '168 85 247'],
    ['rgb(168 85 247 / 50%)', '168 85 247'],
    ['rgb(100%, 0%, 0%)', '255 0 0'],
    ['hsl(0, 100%, 50%)', '255 0 0'],
    ['hsl(120 100% 25%)', '0 128 0'],
    ['hsl(240deg, 100%, 50%)', '0 0 255'],
    ['167 139 250', '167 139 250'],
  ])('parses %j', (input, expected) => {
    expect(toRgbTriplet(input)).toBe(expected)
  })

  it.each(['tomato', 'var(--x)', '#12345', '', undefined])('rejects %j', (input) => {
    expect(toRgbTriplet(input)).toBeNull()
  })

  it('ships 19 presets', () => {
    expect(Object.keys(colorPresets)).toHaveLength(19)
  })
})

describe('getThemeVars', () => {
  it('is empty by default', () => {
    expect(getThemeVars()).toEqual({})
  })

  it('maps color to accent, tint, gradient stop and solid fill', () => {
    expect(getThemeVars({ color: 'purple' })).toEqual({
      '--rns-accent': '168 85 247',
      '--rns-tint': '0.05',
      '--rns-accent-2': '247 85 218',
      '--rns-accent-solid': 'rgb(148 75 218)',
    })
  })

  it('darkens the solid fill until white text reaches 4.5:1 for every preset', () => {
    const lin = (c) => {
      c /= 255
      return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
    }
    for (const name of Object.keys(colorPresets)) {
      const [r, g, b] = getThemeVars({ color: name })['--rns-accent-solid'].match(/\d+/g).map(Number)
      const L = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
      expect(1.05 / (L + 0.05), name).toBeGreaterThanOrEqual(4.5)
    }
  })

  it('turns the tint off when bgColor is set', () => {
    const vars = getThemeVars({ color: 'purple', bgColor: '#fff' })
    expect(vars['--rns-tint']).toBe('0')
    expect(vars['--rns-bg']).toBe('#fff')
  })

  it('derives a focus ring from focusColor', () => {
    expect(getThemeVars({ focusColor: '#ff0000' })['--rns-focus-ring']).toBe('rgb(255 0 0 / 0.22)')
    expect(getThemeVars({ focusColor: 'tomato' })['--rns-focus-ring']).toBe(
      'color-mix(in srgb, tomato 22%, transparent)',
    )
  })

  it('treats numeric radius as px', () => {
    expect(getThemeVars({ radius: 12 })).toEqual({ '--rns-radius': '12px' })
    expect(getThemeVars({ radius: 0 })).toEqual({ '--rns-radius': '0px' })
    expect(getThemeVars({ radius: '1rem' })).toEqual({ '--rns-radius': '1rem' })
  })

  it('warns once for an unknown color and ignores it', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(getThemeVars({ color: 'not-a-color' })).toEqual({})
    getThemeVars({ color: 'not-a-color' })
    expect(warn).toHaveBeenCalledTimes(1)
    warn.mockRestore()
  })
})

describe('filterOptions / flattenOptions', () => {
  const label = (o) => o.label
  const opts = [
    { value: 'x', label: 'Loose' },
    { label: 'Fruits', options: [{ value: 'a', label: 'Apple' }, { value: 'b', label: 'Banana' }] },
    { label: 'Veg', options: [{ value: 'c', label: 'Carrot' }] },
  ]

  it('returns the list untouched without a query', () => {
    expect(filterOptions(opts, '', undefined, label)).toBe(opts)
  })

  it('filters inside groups and drops empty ones', () => {
    const r = filterOptions(opts, 'an', undefined, label)
    expect(r.map((g) => g.label)).toEqual(['Fruits'])
    expect(r[0].options.map((o) => o.value)).toEqual(['b'])
    expect(filterOptions(opts, 'o', undefined, label).map((g) => g.label)).toEqual(['Loose', 'Veg'])
  })

  it('uses a custom filterOption inside groups', () => {
    const r = filterOptions(opts, 'q', (o) => o.value === 'c', label)
    expect(r.map((g) => g.label)).toEqual(['Veg'])
  })

  it('flattens groups for keyboard indexing', () => {
    const { flat, tree } = flattenOptions(opts)
    expect(flat.map((o) => o.value)).toEqual(['x', 'a', 'b', 'c'])
    expect(tree.map((n) => n.type)).toEqual(['option', 'group', 'group'])
    expect(tree[1].children.map((c) => c.index)).toEqual([1, 2])
  })
})
