'use client'

import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Select } from 'react-next-select'

const STATIC_OPTIONS = [
  { value: 'next', label: 'Next.js' },
  { value: 'vite', label: 'Vite' },
  { value: 'rollup', label: 'Rollup' },
  { value: 'webpack', label: 'Webpack' },
  { value: 'parcel', label: 'Parcel' },
  { value: 'snowpack', label: 'Snowpack' },
  { value: 'esbuild', label: 'Esbuild' },
  { value: 'bun', label: 'Bun' },
  { value: 'nx', label: 'Nx' },
  { value: 'pnpm', label: 'Pnpm' },
  { value: 'yarn', label: 'Yarn 4' },
  { value: 'yarn 3', label: 'Yarn 3' },
  { value: 'yarn 2', label: 'Yarn 2' },
  { value: 'yarn 1', label: 'Yarn 1' },
]

const FRAMEWORK_OPTIONS = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'angular', label: 'Angular' },
  { value: 'solid', label: 'SolidJS' },
  { value: 'qwik', label: 'Qwik' },
  { value: 'remix', label: 'Remix' },
  { value: 'astro', label: 'Astro' },
]

function loadOptions(input) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const q = input.trim().toLowerCase()
      resolve(STATIC_OPTIONS.filter((o) => o.label.toLowerCase().includes(q)))
    }, 400)
  })
}

const FEATURES = [
  {
    icon: '⚡',
    title: 'SSR-Safe',
    body: 'Hydration-friendly. Works seamlessly with Next.js App Router & Pages Router.',
  },
  {
    icon: '♿',
    title: 'Accessible',
    body: 'Full keyboard navigation, ARIA roles, and screen-reader announcements out of the box.',
  },
  {
    icon: '🎨',
    title: 'Customizable',
    body: 'Style every part via the `styles` prop, or replace components entirely.',
  },
  {
    icon: '🪶',
    title: 'Lightweight',
    body: 'No heavy dependencies. Tree-shakeable ESM build for tiny bundles.',
  },
]

const THEME_PRESETS = [
  { name: 'Purple', rgb: '167 139 250', hex: '#a78bfa' },
  { name: 'Indigo', rgb: '129 140 248', hex: '#818cf8' },
  { name: 'Blue', rgb: '56 189 248', hex: '#38bdf8' },
  { name: 'Emerald', rgb: '52 211 153', hex: '#34d399' },
  { name: 'Amber', rgb: '251 191 36', hex: '#fbbf24' },
  { name: 'Rose', rgb: '244 114 182', hex: '#f472b6' },
]

const VERSION_HISTORY = [
  {
    version: '0.2.0',
    date: 'Jun 2026',
    latest: true,
    title: 'Themable via CSS variables',
    tags: ['feature'],
    items: [
      'New `--rns-accent`, `--rns-border`, `--rns-bg`, `--rns-text`, `--rns-muted`, `--rns-radius` tokens.',
      'One-line theming — override `--rns-accent: 167 139 250` on `:root` and the whole control retints.',
      'Multi-value chips, focus ring, and selected option now derive from theme tokens.',
      'Default stylesheet refactored with sensible fallbacks — no breaking change for existing users.',
    ],
  },
  {
    version: '0.1.2',
    date: 'May 2026',
    title: 'Custom dropdown icon',
    tags: ['feature', 'demo'],
    items: [
      '`dropdownIcon` prop accepts a string, JSX element, or render function — wrapper handles 180° open/close rotation automatically.',
      'Redesigned demo site with hero, features grid, Theme Studio, and Props Playground.',
      'Netlify deploy config added.',
    ],
  },
  {
    version: '0.1.1',
    date: 'Apr 2026',
    title: 'Polish & demo enhancements',
    tags: ['fix', 'demo'],
    items: [
      'Animated fixed navigation bar that drops in on scroll.',
      'Scroll-to-top button.',
      'Stability fixes for menu placement and outside-click handling.',
    ],
  },
  {
    version: '0.1.0',
    date: 'Mar 2026',
    title: 'Initial release',
    tags: ['release'],
    items: [
      'Single and multi-select with chip rendering.',
      'Synchronous and async options with race-safe loader.',
      'Searchable dropdown — inline or dedicated in-menu search input.',
      'Full keyboard navigation (Arrow / Home / End / Enter / Esc / Tab) with ARIA combobox semantics.',
      'SSR-safe — works out of the box with Next.js App Router and Pages Router.',
      'Hidden `<input name>` for native `<form>` submission.',
    ],
  },
]

const VERSION_TAG_COLORS = {
  feature: { bg: 'rgba(167,139,250,0.15)', border: 'rgba(167,139,250,0.4)', text: '#c4b5fd' },
  fix: { bg: 'rgba(52,211,153,0.15)', border: 'rgba(52,211,153,0.4)', text: '#6ee7b7' },
  demo: { bg: 'rgba(56,189,248,0.15)', border: 'rgba(56,189,248,0.4)', text: '#7dd3fc' },
  release: { bg: 'rgba(251,191,36,0.15)', border: 'rgba(251,191,36,0.4)', text: '#fcd34d' },
}

const hexToRgb = (hex) => {
  const h = hex.replace('#', '')
  const r = parseInt(h.substring(0, 2), 16)
  const g = parseInt(h.substring(2, 4), 16)
  const b = parseInt(h.substring(4, 6), 16)
  return `${r} ${g} ${b}`
}

const rgbToHex = (rgbStr) => {
  const [r, g, b] = rgbStr.split(' ').map(Number)
  const toH = (n) => n.toString(16).padStart(2, '0')
  return `#${toH(r)}${toH(g)}${toH(b)}`
}

/* ---------- Reusable form controls for PropsPlayground ---------- */

function Toggle({ label, checked, onChange, hint }) {
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        padding: '10px 12px',
        background: 'rgb(var(--surface-rgb) / 0.04)',
        border: '1px solid rgb(var(--border-rgb) / 0.08)',
        borderRadius: 10,
        cursor: 'pointer',
        transition: 'background 0.2s, border-color 0.2s',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
        <code
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--text-primary)',
          }}
        >
          {label}
        </code>
        {hint && (
          <span style={{ fontSize: 11, color: 'var(--text-soft)' }}>{hint}</span>
        )}
      </div>
      <span
        onClick={(e) => {
          e.preventDefault()
          onChange(!checked)
        }}
        style={{
          flexShrink: 0,
          width: 38,
          height: 22,
          borderRadius: 999,
          background: checked
            ? 'rgb(var(--rns-accent))'
            : 'rgb(var(--border-rgb) / 0.2)',
          position: 'relative',
          transition: 'background 0.2s',
          cursor: 'pointer',
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 2,
            left: checked ? 18 : 2,
            width: 18,
            height: 18,
            borderRadius: '50%',
            background: '#fff',
            transition: 'left 0.2s',
            boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
          }}
        />
      </span>
    </label>
  )
}

function Segmented({ label, value, options, onChange }) {
  return (
    <div
      style={{
        padding: '10px 12px',
        background: 'rgb(var(--surface-rgb) / 0.04)',
        border: '1px solid rgb(var(--border-rgb) / 0.08)',
        borderRadius: 10,
      }}
    >
      <code
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--text-primary)',
          display: 'block',
          marginBottom: 8,
        }}
      >
        {label}
      </code>
      <div
        style={{
          display: 'flex',
          gap: 4,
          padding: 3,
          background: 'rgb(var(--surface-strong-rgb) / 0.4)',
          borderRadius: 8,
        }}
      >
        {options.map((opt) => {
          const active = opt === value
          return (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              style={{
                flex: 1,
                padding: '6px 10px',
                background: active ? 'rgb(var(--rns-accent) / 0.25)' : 'transparent',
                border: active
                  ? '1px solid rgb(var(--rns-accent) / 0.5)'
                  : '1px solid transparent',
                borderRadius: 6,
                color: active ? 'var(--text-primary)' : 'var(--text-muted)',
                fontSize: 12,
                fontWeight: active ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function TextField({ label, value, onChange, disabled }) {
  return (
    <div
      style={{
        padding: '10px 12px',
        background: 'rgb(var(--surface-rgb) / 0.04)',
        border: '1px solid rgb(var(--border-rgb) / 0.08)',
        borderRadius: 10,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <code
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--text-primary)',
          display: 'block',
          marginBottom: 8,
        }}
      >
        {label}
      </code>
      <input
        type="text"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '8px 10px',
          background: 'rgb(var(--surface-strong-rgb) / 0.5)',
          border: '1px solid rgb(var(--border-rgb) / 0.12)',
          borderRadius: 6,
          color: 'var(--text-primary)',
          fontSize: 13,
          outline: 'none',
          fontFamily: 'inherit',
        }}
      />
    </div>
  )
}

const PROPS_DEFAULTS = {
  isMulti: false,
  isSearchable: true,
  isClearable: true,
  isDisabled: false,
  isLoading: false,
  showMenuSearchInput: false,
  closeMenuOnSelect: true,
  menuPlacement: 'bottom',
  placeholder: 'Pick an option…',
  menuSearchPlaceholder: 'Search options…',
}

function PropsPlayground({ options }) {
  const [config, setConfig] = useState(PROPS_DEFAULTS)
  const [value, setValue] = useState(null)
  const [copied, setCopied] = useState(false)

  const set = (key, val) => {
    setConfig((c) => {
      const next = { ...c, [key]: val }
      // reset value if multi toggles to keep types consistent
      if (key === 'isMulti') setValue(val ? [] : null)
      return next
    })
  }

  const reset = () => {
    setConfig(PROPS_DEFAULTS)
    setValue(null)
  }

  // Build the JSX snippet from current config
  const lines = ['<Select', '  options={options}', '  value={value}', '  onChange={setValue}']
  if (config.isMulti) lines.push('  isMulti')
  if (!config.isSearchable) lines.push('  isSearchable={false}')
  if (config.isClearable) lines.push('  isClearable')
  if (config.isDisabled) lines.push('  isDisabled')
  if (config.isLoading) lines.push('  isLoading')
  if (config.showMenuSearchInput) {
    lines.push('  showMenuSearchInput')
    if (config.menuSearchPlaceholder !== PROPS_DEFAULTS.menuSearchPlaceholder) {
      lines.push(`  menuSearchPlaceholder="${config.menuSearchPlaceholder}"`)
    }
  }
  if (!config.closeMenuOnSelect) lines.push('  closeMenuOnSelect={false}')
  if (config.menuPlacement !== 'bottom') lines.push(`  menuPlacement="${config.menuPlacement}"`)
  if (config.placeholder !== PROPS_DEFAULTS.placeholder) {
    lines.push(`  placeholder="${config.placeholder}"`)
  }
  lines.push('/>')
  const snippet = lines.join('\n')

  const copySnippet = () => {
    navigator.clipboard.writeText(snippet)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <section
      className="fade-up"
      style={{
        marginBottom: 80,
        padding: 'clamp(20px, 4vw, 32px)',
        background: 'rgb(var(--surface-rgb) / 0.04)',
        border: '1px solid rgb(var(--border-rgb) / 0.08)',
        borderRadius: 24,
        backdropFilter: 'blur(12px)',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <Tag color="#38bdf8">🛝 Props Playground</Tag>
        <h2
          style={{
            margin: '14px 0 8px',
            fontSize: 32,
            fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: -0.5,
          }}
        >
          Toggle every option, live
        </h2>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 15 }}>
          Mix and match props — the live preview and snippet below update as you go.
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}
      >
        {/* Top — controls (multi-column grid to use horizontal space) */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 12,
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              Props
            </span>
            <button
              onClick={reset}
              style={{
                padding: '4px 10px',
                fontSize: 11,
                fontWeight: 600,
                color: 'var(--text-muted)',
                background: 'transparent',
                border: '1px solid rgb(var(--border-rgb) / 0.12)',
                borderRadius: 6,
                cursor: 'pointer',
              }}
            >
              ↺ Reset
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
              gap: 10,
              alignItems: 'start',
            }}
          >
            <Toggle
              label="isMulti"
              checked={config.isMulti}
              onChange={(v) => set('isMulti', v)}
              hint="Allow multiple selections"
            />
            <Toggle
              label="isSearchable"
              checked={config.isSearchable}
              onChange={(v) => set('isSearchable', v)}
              hint="Type to filter options"
            />
            <Toggle
              label="isClearable"
              checked={config.isClearable}
              onChange={(v) => set('isClearable', v)}
              hint="Show ✕ button to clear"
            />
            <Toggle
              label="isDisabled"
              checked={config.isDisabled}
              onChange={(v) => set('isDisabled', v)}
              hint="Disable the entire control"
            />
            <Toggle
              label="isLoading"
              checked={config.isLoading}
              onChange={(v) => set('isLoading', v)}
              hint="Show loading state"
            />
            <Toggle
              label="showMenuSearchInput"
              checked={config.showMenuSearchInput}
              onChange={(v) => set('showMenuSearchInput', v)}
              hint="Dedicated search input inside menu"
            />
            <Toggle
              label="closeMenuOnSelect"
              checked={config.closeMenuOnSelect}
              onChange={(v) => set('closeMenuOnSelect', v)}
              hint="Close menu after picking"
            />
            <Segmented
              label="menuPlacement"
              value={config.menuPlacement}
              options={['bottom', 'top']}
              onChange={(v) => set('menuPlacement', v)}
            />
            <TextField
              label="placeholder"
              value={config.placeholder}
              onChange={(v) => set('placeholder', v)}
            />
            <TextField
              label="menuSearchPlaceholder"
              value={config.menuSearchPlaceholder}
              onChange={(v) => set('menuSearchPlaceholder', v)}
              disabled={!config.showMenuSearchInput}
            />
          </div>
        </div>

        {/* Bottom — Live preview + snippet (full width) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label
              style={{
                display: 'block',
                marginBottom: 10,
                fontSize: 11,
                fontWeight: 700,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              Live Preview
            </label>
            <div
              style={{
                padding: 20,
                background: 'rgb(var(--surface-strong-rgb) / 0.5)',
                border: '1px solid rgb(var(--border-rgb) / 0.08)',
                borderRadius: 12,
                minHeight: 220,
              }}
            >
              <Select
                options={options}
                value={value}
                onChange={setValue}
                isMulti={config.isMulti}
                isSearchable={config.isSearchable}
                isClearable={config.isClearable}
                isDisabled={config.isDisabled}
                isLoading={config.isLoading}
                showMenuSearchInput={config.showMenuSearchInput}
                closeMenuOnSelect={config.closeMenuOnSelect}
                menuPlacement={config.menuPlacement}
                placeholder={config.placeholder}
                menuSearchPlaceholder={config.menuSearchPlaceholder}
              />
              {value && (config.isMulti ? value.length > 0 : true) && (
                <div
                  style={{
                    marginTop: 14,
                    padding: '10px 12px',
                    background: 'rgb(var(--rns-accent) / 0.12)',
                    border: '1px solid rgb(var(--rns-accent) / 0.3)',
                    borderRadius: 8,
                    fontSize: 12,
                    color: 'var(--text-secondary)',
                  }}
                >
                  <strong style={{ color: 'var(--text-primary)' }}>Selected:</strong>{' '}
                  {config.isMulti
                    ? value.map((v) => v.label).join(', ')
                    : value.label}
                </div>
              )}
            </div>
          </div>

          <div>
            <label
              style={{
                display: 'block',
                marginBottom: 10,
                fontSize: 11,
                fontWeight: 700,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              Generated JSX
            </label>
            <div
              style={{
                position: 'relative',
                background: 'rgb(var(--code-rgb) / 0.7)',
                border: '1px solid rgb(var(--border-rgb) / 0.08)',
                borderRadius: 10,
                padding: '14px 16px',
                fontSize: 12.5,
                lineHeight: 1.6,
                color: 'var(--text-secondary)',
                overflow: 'auto',
              }}
            >
              <button
                onClick={copySnippet}
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  padding: '4px 10px',
                  fontSize: 11,
                  fontWeight: 600,
                  background: copied
                    ? 'rgba(34, 197, 94, 0.2)'
                    : 'rgb(var(--rns-accent) / 0.2)',
                  color: copied ? '#86efac' : 'var(--text-primary)',
                  border: `1px solid ${copied ? 'rgba(34, 197, 94, 0.4)' : 'rgb(var(--rns-accent) / 0.5)'
                    }`,
                  borderRadius: 6,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {snippet}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ThemeStudio({ themeOptions }) {
  const [accent, setAccent] = useState('167 139 250')
  const [preview, setPreview] = useState(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    document.documentElement.style.setProperty('--rns-accent', accent)
  }, [accent])

  const cssSnippet = `:root {\n  --rns-accent: ${accent};\n}`

  const copySnippet = () => {
    navigator.clipboard.writeText(cssSnippet)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <section
      className="fade-up"
      style={{
        marginBottom: 80,
        padding: 'clamp(20px, 4vw, 32px)',
        background:
          'linear-gradient(135deg, rgb(var(--rns-accent) / 0.08), rgba(255,255,255,0.02))',
        border: '1px solid rgb(var(--rns-accent) / 0.25)',
        borderRadius: 24,
        backdropFilter: 'blur(12px)',
        transition: 'background 0.3s, border-color 0.3s',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <Tag color={rgbToHex(accent)}>🎨 Theme Studio</Tag>
        <h2
          style={{
            margin: '14px 0 8px',
            fontSize: 32,
            fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: -0.5,
          }}
        >
          Pick a color, see it live
        </h2>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 15 }}>
          Every Select on this page updates instantly. Powered by a single CSS variable.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
          gap: 28,
          alignItems: 'start',
        }}
      >
        {/* Left: Picker */}
        <div>
          <label
            style={{
              display: 'block',
              marginBottom: 10,
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}
          >
            Presets
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
            {THEME_PRESETS.map((p) => {
              const active = p.rgb === accent
              const [r, g, b] = p.rgb.split(' ')
              return (
                <button
                  key={p.name}
                  onClick={() => setAccent(p.rgb)}
                  title={p.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 14px',
                    background: active
                      ? `rgba(${r}, ${g}, ${b}, 0.18)`
                      : 'rgb(var(--surface-rgb) / 0.04)',
                    border: `1px solid ${active ? p.hex : 'rgb(var(--border-rgb) / 0.12)'
                      }`,
                    boxShadow: active
                      ? `0 0 0 2px rgba(${r}, ${g}, ${b}, 0.18)`
                      : 'none',
                    borderRadius: 10,
                    cursor: 'pointer',
                    color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                    fontSize: 13,
                    fontWeight: active ? 600 : 500,
                    transition: 'all 0.2s',
                  }}
                >
                  <span
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: 4,
                      background: p.hex,
                      boxShadow: `0 0 0 2px rgb(var(--border-rgb) / 0.12)`,
                    }}
                  />
                  {p.name}
                </button>
              )
            })}
          </div>

          <label
            style={{
              display: 'block',
              marginBottom: 10,
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}
          >
            Custom color
          </label>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: 8,
              background: 'rgb(var(--surface-strong-rgb) / 0.5)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 10,
              marginBottom: 20,
            }}
          >
            <input
              type="color"
              value={rgbToHex(accent)}
              onChange={(e) => setAccent(hexToRgb(e.target.value))}
              style={{
                width: 44,
                height: 36,
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                padding: 0,
              }}
            />
            <code style={{ color: 'var(--text-secondary)', fontSize: 13, flex: 1 }}>
              {rgbToHex(accent)}
            </code>
            <code style={{ color: 'var(--text-soft)', fontSize: 12 }}>rgb({accent.replace(/ /g, ', ')})</code>
          </div>

          {/* CSS snippet */}
          <div
            style={{
              position: 'relative',
              background: 'rgb(var(--code-rgb) / 0.7)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 10,
              padding: '14px 16px',
              fontSize: 13,
              color: 'var(--text-secondary)',
            }}
          >
            <button
              onClick={copySnippet}
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                padding: '4px 10px',
                fontSize: 11,
                fontWeight: 600,
                background: copied
                  ? 'rgba(34, 197, 94, 0.2)'
                  : 'rgb(var(--rns-accent) / 0.2)',
                color: copied ? '#86efac' : 'var(--text-primary)',
                border: `1px solid ${copied ? 'rgba(34, 197, 94, 0.4)' : 'rgb(var(--rns-accent) / 0.5)'
                  }`,
                borderRadius: 6,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {copied ? '✓ Copied' : 'Copy CSS'}
            </button>
            <pre style={{ margin: 0, lineHeight: 1.6 }}>{cssSnippet}</pre>
          </div>
        </div>

        {/* Right: Live Preview */}
        <div>
          <label
            style={{
              display: 'block',
              marginBottom: 10,
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}
          >
            Live Preview
          </label>
          <div
            style={{
              padding: 20,
              background: 'rgb(var(--surface-strong-rgb) / 0.5)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12,
              minHeight: 220,
            }}
          >
            <Select
              options={themeOptions}
              value={preview}
              onChange={setPreview}
              isClearable
              showMenuSearchInput
              menuSearchPlaceholder="Try the new theme..."
              placeholder="Open me to see the colors…"
            />
            <p
              style={{
                margin: '14px 0 0',
                fontSize: 12,
                color: 'var(--text-soft)',
                textAlign: 'center',
                lineHeight: 1.6,
              }}
            >
              💡 Scroll down — <strong style={{ color: 'var(--text-secondary)' }}>every</strong> Select below
              uses this color too.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function Tag({ children, color = '#a78bfa' }) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '4px 10px',
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 0.3,
        textTransform: 'uppercase',
        background: `${color}26`,
        color,
        border: `1px solid ${color}66`,
      }}
    >
      {children}
    </span>
  )
}

function DemoCard({ tags, title, description, children, code }) {
  const [copied, setCopied] = useState(false)
  const copyCode = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <article
      className="fade-up"
      style={{
        background: 'rgb(var(--surface-rgb) / 0.04)',
        border: '1px solid rgb(var(--border-rgb) / 0.08)',
        borderRadius: 20,
        padding: 28,
        backdropFilter: 'blur(10px)',
        transition: 'transform 0.2s ease, border-color 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgb(var(--rns-accent) / 0.4)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgb(var(--border-rgb) / 0.08)'
      }}
    >
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        {tags?.map((t) => (
          <Tag key={t.label} color={t.color}>
            {t.label}
          </Tag>
        ))}
      </div>
      <h3 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>
        {title}
      </h3>
      <p style={{ margin: '0 0 20px', color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6 }}>
        {description}
      </p>

      <div style={{ marginBottom: code ? 18 : 0 }}>{children}</div>

      {code && (
        <div
          style={{
            position: 'relative',
            background: 'rgb(var(--code-rgb) / 0.7)',
            border: '1px solid rgb(var(--border-rgb) / 0.06)',
            borderRadius: 10,
            padding: '14px 16px',
            fontSize: 12.5,
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
            overflow: 'auto',
          }}
        >
          <button
            onClick={copyCode}
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              padding: '4px 10px',
              fontSize: 11,
              fontWeight: 600,
              background: copied ? 'rgba(34, 197, 94, 0.2)' : 'rgb(var(--rns-accent) / 0.2)',
              color: copied ? '#86efac' : 'var(--text-primary)',
              border: `1px solid ${copied ? 'rgba(34, 197, 94, 0.4)' : 'rgb(var(--rns-accent) / 0.5)'}`,
              borderRadius: 6,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{code}</pre>
        </div>
      )}
    </article>
  )
}

const DROPDOWN_ICON_VARIANTS = {
  thick: {
    label: 'Thick chevron',
    render: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    ),
    snippet: `<Select
  options={options}
  dropdownIcon={
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="3"
      strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  }
/>`,
  },
  emoji: {
    label: '🔽 Emoji',
    render: '🔽',
    snippet: `<Select options={options} dropdownIcon="🔽" />`,
  },
  toggle: {
    label: '+ / − Stateful',
    render: ({ isOpen }) => (
      <span style={{ fontSize: 18, fontWeight: 700, lineHeight: 1 }}>
        {isOpen ? '−' : '+'}
      </span>
    ),
    snippet: `<Select
  options={options}
  dropdownIcon={({ isOpen }) => (
    <span style={{ fontSize: 18, fontWeight: 700 }}>
      {isOpen ? '−' : '+'}
    </span>
  )}
/>`,
  },
  star: {
    label: '★ Star',
    render: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l2.7 7h7.3l-6 4.5 2.3 7.5L12 16.7 5.7 21l2.3-7.5-6-4.5h7.3z" />
      </svg>
    ),
    snippet: `<Select
  options={options}
  dropdownIcon={
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l2.7 7h7.3l-6 4.5 2.3 7.5L12 16.7 5.7 21l2.3-7.5-6-4.5h7.3z" />
    </svg>
  }
/>`,
  },
}

export default function Page() {
  const [single, setSingle] = useState(null)
  const [multi, setMulti] = useState([])
  const [framework, setFramework] = useState(null)
  const [asyncValue, setAsyncValue] = useState(null)
  const [customValue, setCustomValue] = useState(null)
  const [iconValue, setIconValue] = useState(null)
  const [iconChoice, setIconChoice] = useState('thick')
  const [mode, setMode] = useState('dark')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode)
  }, [mode])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const [copiedStep, setCopiedStep] = useState(null)
  const copyStep = (text, key) => {
    navigator.clipboard.writeText(text)
    setCopiedStep(key)
    setTimeout(() => setCopiedStep(null), 1500)
  }

  const customOption = useCallback((props) => {
    const { innerProps, data, isFocused, isSelected } = props
    return (
      <div
        {...innerProps}
        style={{
          padding: '12px 14px',
          cursor: 'pointer',
          background: isSelected
            ? 'rgb(var(--rns-accent) / 0.35)'
            : isFocused
              ? 'rgb(var(--rns-accent) / 0.15)'
              : 'transparent',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          borderBottom: '1px solid rgb(var(--border-rgb) / 0.05)',
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: 'linear-gradient(135deg, #a78bfa, #ec4899)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          {data.label.charAt(0)}
        </div>
        <div>
          <div style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 14 }}>{data.label}</div>
          <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>{data.value}</div>
        </div>
      </div>
    )
  }, [])

  return (
    <>
      {/* Fixed animated nav */}
      <nav
        className="rns-demo__nav"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: scrolled
            ? 'rgb(var(--nav-rgb) / 0.85)'
            : 'rgb(var(--nav-rgb) / 0.45)',
          backdropFilter: scrolled ? 'blur(18px) saturate(160%)' : 'blur(10px)',
          WebkitBackdropFilter: scrolled ? 'blur(18px) saturate(160%)' : 'blur(10px)',
          borderBottom: scrolled
            ? '1px solid rgb(var(--border-rgb) / 0.14)'
            : '1px solid rgb(var(--border-rgb) / 0.04)',
          boxShadow: scrolled
            ? '0 10px 30px -12px rgba(0,0,0,0.45), 0 2px 6px -2px rgba(0,0,0,0.25)'
            : '0 0 0 rgba(0,0,0,0)',
          transform: scrolled ? 'translateY(0)' : 'translateY(0)',
          animation: 'rns-nav-drop 0.55s cubic-bezier(0.22, 1, 0.36, 1) both',
          transition:
            'background 0.35s ease, backdrop-filter 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease, padding 0.35s ease',
        }}
      >
        <div
          className="rns-demo__nav-row"
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: scrolled ? '10px 20px' : '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
            flexWrap: 'wrap',
            transition: 'padding 0.35s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            <div
              style={{
                width: scrolled ? 28 : 32,
                height: scrolled ? 28 : 32,
                flexShrink: 0,
                borderRadius: 8,
                background: 'linear-gradient(135deg, #a78bfa, #ec4899)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                color: '#fff',
                fontSize: scrolled ? 13 : 15,
                boxShadow: scrolled
                  ? '0 4px 12px -2px rgba(167,139,250,0.45)'
                  : '0 0 0 rgba(0,0,0,0)',
                transition: 'all 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              R
            </div>
            <span
              className="rns-demo__brand-text"
              style={{
                fontWeight: 700,
                fontSize: scrolled ? 15 : 16,
                color: 'var(--text-primary)',
                whiteSpace: 'nowrap',
                transition: 'font-size 0.35s ease',
              }}
            >
              react-next-select
            </span>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
              title={mode === 'dark' ? 'Switch to light' : 'Switch to dark'}
              aria-label="Toggle theme"
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                fontSize: 16,
                color: 'var(--text-primary)',
                border: '1px solid rgb(var(--border-rgb) / 0.12)',
                background: 'rgb(var(--surface-rgb) / 0.05)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
              }}
            >
              {mode === 'dark' ? '☀️' : '🌙'}
            </button>
            <a
              href="https://github.com/yogeshgabani/react-next-select"
              target="_blank"
              rel="noreferrer"
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                color: 'var(--text-secondary)',
                border: '1px solid rgb(var(--border-rgb) / 0.12)',
                background: 'rgb(var(--surface-rgb) / 0.05)',
                transition: 'all 0.2s',
              }}
            >
              GitHub
            </a>
            <a
              href="https://www.npmjs.com/package/react-next-select"
              target="_blank"
              rel="noreferrer"
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                color: '#fff',
                background: 'linear-gradient(135deg, #a78bfa, #ec4899)',
                transition: 'all 0.2s',
              }}
            >
              npm
            </a>
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '120px 24px 80px' }}>
        {/* Hero */}
        <section className="fade-up" style={{ textAlign: 'center', marginBottom: 80 }}>
          <div style={{ display: 'inline-flex', marginBottom: 20 }}>
            <Tag color="#a78bfa">V0.1.2 · Now Available</Tag>
          </div>
          <h1
            style={{
              margin: '0 0 20px',
              fontSize: 'clamp(36px, 6vw, 64px)',
              lineHeight: 1.1,
              fontWeight: 800,
              letterSpacing: -1,
              color: 'var(--text-primary)',
            }}
          >
            The{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #a78bfa, #ec4899, #38bdf8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Select component
            </span>
            <br />
            built for Next.js
          </h1>
          <p
            style={{
              maxWidth: 640,
              margin: '0 auto 36px',
              fontSize: 18,
              lineHeight: 1.7,
              color: 'var(--text-muted)',
            }}
          >
            Accessible, SSR-safe, fully customizable. Single & multi-select, async loading, custom
            components — all in a tiny, tree-shakeable bundle.
          </p>

          {/* Quick Start — 2-step setup */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              padding: 16,
              background: 'rgb(var(--surface-strong-rgb) / 0.6)',
              border: '1px solid rgb(var(--rns-accent) / 0.35)',
              borderRadius: 14,
              backdropFilter: 'blur(8px)',
              transition: 'border-color 0.3s',
              width: '100%',
              maxWidth: 560,
              margin: '0 auto',
              textAlign: 'left',
              boxSizing: 'border-box',
            }}
          >
            {[
              { key: 'install', prompt: '$', code: 'npm install react-next-select', label: '1. Install' },
              { key: 'import', prompt: 'JS', code: "import 'react-next-select/style.css'", label: '2. Import styles (once) in App.js/App/jsx or Page.js/Page.jsx or any other file' },
            ].map(({ key, prompt, code, label }) => {
              const isCopied = copiedStep === key
              return (
                <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: 0.5,
                      textTransform: 'uppercase',
                      color: 'var(--text-soft)',
                    }}
                  >
                    {label}
                  </span>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 14px',
                      background: 'rgb(var(--code-rgb) / 0.6)',
                      border: '1px solid rgb(var(--border-rgb) / 0.08)',
                      borderRadius: 10,
                      minWidth: 0,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: 'rgb(var(--rns-accent))',
                        minWidth: 22,
                        flexShrink: 0,
                        userSelect: 'none',
                      }}
                    >
                      {prompt}
                    </span>
                    <code
                      style={{
                        flex: '1 1 0',
                        minWidth: 0,
                        color: 'var(--text-secondary)',
                        fontSize: 13.5,
                        whiteSpace: 'nowrap',
                        overflowX: 'auto',
                      }}
                    >
                      {code}
                    </code>
                    <button
                      onClick={() => copyStep(code, key)}
                      style={{
                        padding: '5px 11px',
                        fontSize: 11,
                        fontWeight: 600,
                        background: isCopied ? 'rgba(34, 197, 94, 0.2)' : 'rgb(var(--rns-accent) / 0.22)',
                        color: isCopied ? '#86efac' : 'var(--text-primary)',
                        border: `1px solid ${isCopied ? 'rgba(34, 197, 94, 0.4)' : 'rgb(var(--rns-accent) / 0.5)'
                          }`,
                        borderRadius: 6,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        flexShrink: 0,
                      }}
                    >
                      {isCopied ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Features Grid */}
        <section
          className="fade-up"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
            gap: 16,
            marginBottom: 80,
          }}
        >
          {FEATURES.map((f) => (
            <div
              key={f.title}
              style={{
                padding: 24,
                background: 'rgb(var(--surface-rgb) / 0.03)',
                border: '1px solid rgb(var(--border-rgb) / 0.06)',
                borderRadius: 16,
                transition: 'transform 0.2s ease, border-color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.borderColor = 'rgb(var(--rns-accent) / 0.35)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.borderColor = 'rgb(var(--border-rgb) / 0.06)'
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 10 }}>{f.icon}</div>
              <h3 style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
                {f.title}
              </h3>
              <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6, color: 'var(--text-muted)' }}>
                {f.body}
              </p>
            </div>
          ))}
        </section>

        {/* Theme Studio — live color picker that updates --rns-accent */}
        <ThemeStudio themeOptions={FRAMEWORK_OPTIONS} />

        {/* Props Playground — toggle every prop live */}
        <PropsPlayground options={STATIC_OPTIONS} />

        {/* Demos */}
        <section style={{ marginBottom: 40 }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <Tag color="#38bdf8">Live Demos</Tag>
            <h2
              style={{
                margin: '14px 0 8px',
                fontSize: 36,
                fontWeight: 800,
                color: 'var(--text-primary)',
                letterSpacing: -0.5,
              }}
            >
              Try it yourself
            </h2>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 15 }}>
              Every variant is fully interactive. Click around — keyboard works too.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
              gap: 20,
            }}
          >
            <DemoCard
              tags={[
                { label: 'Single', color: '#a78bfa' },
                { label: 'Searchable', color: '#38bdf8' },
              ]}
              title="Single · Searchable · Clearable"
              description="The classic dropdown. Search to filter, click ✕ to clear."
              code={`<Select
  options={options}
  value={value}
  onChange={setValue}
  isClearable
  showMenuSearchInput
  placeholder="Pick a bundler…"
/>`}
            >
              <Select
                options={STATIC_OPTIONS}
                value={single}
                onChange={setSingle}
                isClearable
                placeholder="Pick a bundler…"
                showMenuSearchInput
              />
              {single && (
                <div
                  style={{
                    marginTop: 12,
                    padding: '10px 14px',
                    background: 'rgba(34, 197, 94, 0.1)',
                    border: '1px solid rgba(34, 197, 94, 0.25)',
                    borderRadius: 8,
                    fontSize: 13,
                    color: '#86efac',
                  }}
                >
                  Selected: <strong>{single.label}</strong>
                </div>
              )}
            </DemoCard>

            <DemoCard
              tags={[
                { label: 'Multi', color: '#ec4899' },
                { label: 'Chips', color: '#a78bfa' },
              ]}
              title="Multi-select"
              description="Pick many. Menu stays open while you keep selecting."
              code={`<Select
  options={options}
  value={value}
  onChange={setValue}
  isMulti
  isClearable
  closeMenuOnSelect={false}
/>`}
            >
              <Select
                options={STATIC_OPTIONS}
                value={multi}
                onChange={setMulti}
                isMulti
                isClearable
                closeMenuOnSelect={false}
                placeholder="Choose several…"
              />
            </DemoCard>

            <DemoCard
              tags={[
                { label: 'Multi', color: '#ec4899' },
                { label: 'Search inside', color: '#38bdf8' },
              ]}
              title="Multi with in-menu search"
              description="A dedicated search field lives inside the menu — great for long lists."
              code={`<Select
  options={options}
  isMulti
  showMenuSearchInput
  menuSearchPlaceholder="Search options..."
/>`}
            >
              <Select
                options={STATIC_OPTIONS}
                value={multi}
                onChange={setMulti}
                isMulti
                isClearable
                closeMenuOnSelect={false}
                showMenuSearchInput
                menuSearchPlaceholder="Search options..."
                placeholder="Select multiple tools..."
              />
            </DemoCard>

            <DemoCard
              tags={[
                { label: 'Async', color: '#f59e0b' },
                { label: 'Debounced', color: '#a78bfa' },
              ]}
              title="Async options"
              description="Fetch options from anywhere — APIs, databases, anything Promise-based."
              code={`<Select
  loadOptions={async (input) => {
    const res = await fetch(\`/api/search?q=\${input}\`)
    return res.json()
  }}
  defaultOptions
/>`}
            >
              <Select
                loadOptions={loadOptions}
                defaultOptions
                placeholder="Type to search (simulated 400ms delay)…"
                onChange={setAsyncValue}
                value={asyncValue}
              />
            </DemoCard>

            <DemoCard
              tags={[
                { label: 'Custom UI', color: '#ec4899' },
                { label: 'Components', color: '#38bdf8' },
              ]}
              title="Custom Option component"
              description="Swap in your own Option renderer. Show avatars, badges, anything."
              code={`<Select
  options={options}
  components={{ Option: MyOption }}
/>`}
            >
              <Select
                options={STATIC_OPTIONS}
                components={{ Option: customOption }}
                onChange={setCustomValue}
                value={customValue}
                placeholder="See the custom rows…"
              />
            </DemoCard>

            <DemoCard
              tags={[
                { label: 'Custom Icon', color: '#a78bfa' },
                { label: 'dropdownIcon', color: '#fbbf24' },
              ]}
              title="Custom dropdown icon"
              description="Swap the chevron without writing a full component. Pass a string, a ReactNode, or a function that receives { isOpen }. The 180° rotation animates automatically."
              code={DROPDOWN_ICON_VARIANTS[iconChoice].snippet}
            >
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 6,
                  marginBottom: 12,
                }}
              >
                {Object.entries(DROPDOWN_ICON_VARIANTS).map(([key, v]) => {
                  const active = key === iconChoice
                  return (
                    <button
                      key={key}
                      onClick={() => setIconChoice(key)}
                      style={{
                        padding: '6px 12px',
                        fontSize: 12,
                        fontWeight: active ? 600 : 500,
                        color: active
                          ? 'var(--text-primary)'
                          : 'var(--text-muted)',
                        background: active
                          ? 'rgb(var(--rns-accent) / 0.25)'
                          : 'rgb(var(--surface-rgb) / 0.04)',
                        border: `1px solid ${active
                          ? 'rgb(var(--rns-accent) / 0.6)'
                          : 'rgb(var(--border-rgb) / 0.12)'
                          }`,
                        borderRadius: 8,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      {v.label}
                    </button>
                  )
                })}
              </div>
              <Select
                options={STATIC_OPTIONS}
                value={iconValue}
                onChange={setIconValue}
                isClearable
                placeholder="Open me — watch the icon…"
                dropdownIcon={DROPDOWN_ICON_VARIANTS[iconChoice].render}
              />
            </DemoCard>

            <DemoCard
              tags={[
                { label: 'Simple', color: '#a78bfa' },
                { label: 'Defaults', color: 'var(--text-soft)' },
              ]}
              title="Plain & minimal"
              description="Drop it in with zero config — sensible defaults, accessible from day one."
              code={`<Select options={options} onChange={setValue} />`}
            >
              <Select
                options={FRAMEWORK_OPTIONS}
                value={framework}
                onChange={setFramework}
                placeholder="Pick a framework…"
                isClearable
              />
            </DemoCard>
          </div>
        </section>

        {/* Version History — timeline of releases */}
        <section
          id="changelog"
          className="fade-up"
          style={{
            marginBottom: 80,
            padding: 'clamp(20px, 4vw, 32px)',
            background: 'rgb(var(--surface-rgb) / 0.04)',
            border: '1px solid rgb(var(--border-rgb) / 0.08)',
            borderRadius: 24,
            backdropFilter: 'blur(12px)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <Tag color="#fbbf24">📜 Changelog</Tag>
            <h2
              style={{
                margin: '14px 0 8px',
                fontSize: 32,
                fontWeight: 800,
                color: 'var(--text-primary)',
                letterSpacing: -0.5,
              }}
            >
              Version History
            </h2>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 15 }}>
              What changed in each release — newest at the top.
            </p>
          </div>

          <div
            className="rns-changelog__timeline"
            style={{
              position: 'relative',
              paddingLeft: 28,
              paddingRight: 8,
              paddingTop: 20,
              paddingBottom: 20,
              maxHeight: 'min(60vh, 520px)',
              overflowY: 'auto',
              // Soft fade hints there's more content above/below
              maskImage:
                'linear-gradient(180deg, transparent 0, #000 16px, #000 calc(100% - 16px), transparent 100%)',
              WebkitMaskImage:
                'linear-gradient(180deg, transparent 0, #000 16px, #000 calc(100% - 16px), transparent 100%)',
            }}
          >
            {/* Vertical timeline rail */}
            <div
              aria-hidden
              style={{
                position: 'absolute',
                top: 8,
                bottom: 8,
                left: 9,
                width: 2,
                background:
                  'linear-gradient(180deg, rgb(var(--rns-accent) / 0.55) 0%, rgb(var(--rns-accent) / 0.15) 100%)',
                borderRadius: 2,
              }}
            />

            {VERSION_HISTORY.map((v) => (
              <article
                key={v.version}
                className="rns-changelog__entry"
                style={{
                  position: 'relative',
                  marginBottom: 28,
                  paddingLeft: 18,
                }}
              >
                {/* Timeline node */}
                <span
                  aria-hidden
                  style={{
                    position: 'absolute',
                    left: -28,
                    top: 6,
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: v.latest
                      ? 'linear-gradient(135deg, #a855f7, #ec4899)'
                      : 'rgb(var(--surface-strong-rgb))',
                    border: v.latest
                      ? '2px solid rgba(167,139,250,0.5)'
                      : '2px solid rgb(var(--rns-accent) / 0.4)',
                    boxShadow: v.latest
                      ? '0 0 0 4px rgba(167,139,250,0.18), 0 0 16px rgba(168,85,247,0.5)'
                      : 'none',
                  }}
                />

                {/* Header row: version + date + tags */}
                <div
                  className="rns-changelog__header"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 10,
                    marginBottom: 8,
                  }}
                >
                  <span
                    className="rns-changelog__version-pill"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '4px 12px',
                      borderRadius: 999,
                      fontSize: 13,
                      fontWeight: 700,
                      letterSpacing: 0.3,
                      fontFamily:
                        '"JetBrains Mono", ui-monospace, SFMono-Regular, monospace',
                      background: v.latest
                        ? 'linear-gradient(135deg, #a855f7, #ec4899)'
                        : 'rgb(var(--rns-accent) / 0.15)',
                      color: v.latest ? '#fff' : 'var(--text-primary)',
                      border: v.latest
                        ? 'none'
                        : '1px solid rgb(var(--rns-accent) / 0.35)',
                      boxShadow: v.latest
                        ? '0 4px 14px rgba(168,85,247,0.35)'
                        : 'none',
                    }}
                  >
                    v{v.version}
                  </span>
                  {v.latest && (
                    <span
                      style={{
                        padding: '3px 9px',
                        borderRadius: 6,
                        fontSize: 10,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: 0.6,
                        background: 'rgba(52,211,153,0.18)',
                        color: '#6ee7b7',
                        border: '1px solid rgba(52,211,153,0.4)',
                      }}
                    >
                      ● Latest
                    </span>
                  )}
                  <span
                    className="rns-changelog__date"
                    style={{
                      fontSize: 13,
                      color: 'var(--text-muted)',
                    }}
                  >
                    {v.date}
                  </span>
                  <span style={{ flex: 1 }} />
                  {v.tags?.map((t) => {
                    const c = VERSION_TAG_COLORS[t] || VERSION_TAG_COLORS.feature
                    return (
                      <span
                        key={t}
                        style={{
                          padding: '3px 10px',
                          borderRadius: 6,
                          fontSize: 11,
                          fontWeight: 600,
                          textTransform: 'capitalize',
                          background: c.bg,
                          color: c.text,
                          border: `1px solid ${c.border}`,
                        }}
                      >
                        {t}
                      </span>
                    )
                  })}
                </div>

                {/* Title */}
                <h3
                  style={{
                    margin: '0 0 10px',
                    fontSize: 17,
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    letterSpacing: -0.2,
                  }}
                >
                  {v.title}
                </h3>

                {/* Bullet items */}
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: 18,
                    color: 'var(--text-secondary)',
                    fontSize: 13.5,
                    lineHeight: 1.7,
                  }}
                >
                  {v.items.map((line, i) => (
                    <li key={i} style={{ marginBottom: 2 }}>
                      {line}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer style={{ marginTop: 96, marginBottom: 24 }}>
          <div
            style={{
              position: 'relative',
              borderRadius: 20,
              padding: 1,
              background:
                'linear-gradient(135deg, rgba(244,114,182,0.55) 0%, rgba(167,139,250,0.15) 40%, rgba(56,189,248,0.55) 100%)',
            }}
          >
            <div
              style={{
                borderRadius: 19,
                background:
                  'linear-gradient(180deg, rgb(var(--surface-strong-rgb) / 0.85) 0%, rgb(var(--surface-strong-rgb) / 0.95) 100%)',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                padding: '28px 20px',
              }}
            >
              {/* Top row: brand + action buttons */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 20,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div
                    style={{
                      width: 44,
                      height: 30,
                      borderRadius: 10,
                      background: 'rgba(167,139,250,0.12)',
                      border: '1px solid rgba(167,139,250,0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 5,
                      padding: '4px',
                    }}
                  >
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#a78bfa' }} />
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#f472b6' }} />
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#38bdf8' }} />
                  </div>
                  <div>
                    <div
                      style={{
                        color: 'var(--text-primary)',
                        fontWeight: 700,
                        fontSize: 16,
                        letterSpacing: '-0.01em',
                      }}
                    >
                      react-next-select
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 2 }}>
                      Modern, accessible select component for React & Next.js
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <a
                    href="https://github.com/yogeshgabani/react-next-select"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '9px 16px',
                      borderRadius: 999,
                      border: '1px solid rgb(var(--border-rgb) / 0.18)',
                      background: 'rgb(var(--surface-rgb) / 0.04)',
                      color: 'var(--text-primary)',
                      fontSize: 13,
                      fontWeight: 500,
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.34-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.25 5.68.41.35.78 1.04.78 2.1v3.11c0 .31.21.67.79.56 4.57-1.52 7.86-5.83 7.86-10.91C23.5 5.65 18.35.5 12 .5Z" />
                    </svg>
                    GitHub
                  </a>
                  <a
                    href="https://www.npmjs.com/package/react-next-select"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '9px 16px',
                      borderRadius: 999,
                      border: '1px solid rgb(var(--border-rgb) / 0.18)',
                      background: 'rgb(var(--surface-rgb) / 0.04)',
                      color: 'var(--text-primary)',
                      fontSize: 13,
                      fontWeight: 500,
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <svg width="22" height="14" viewBox="0 0 27 16" fill="currentColor" aria-hidden>
                      <path d="M0 0h27v14H14v2H7v-2H0V0Zm2 12h5V4h3v8h2V2H2v10Zm12-10v12h5v-2h5V2H14Zm8 2h-3v6h3V4Z" />
                    </svg>
                    npm
                  </a>
                  <a
                    href="#demos"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '9px 16px',
                      borderRadius: 999,
                      border: '1px solid rgb(var(--border-rgb) / 0.18)',
                      background: 'rgb(var(--surface-rgb) / 0.04)',
                      color: 'var(--text-primary)',
                      fontSize: 13,
                      fontWeight: 500,
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <rect x="3" y="4" width="18" height="14" rx="2" />
                      <path d="M3 8h18" />
                    </svg>
                    Demos
                  </a>
                </div>
              </div>

              {/* Divider */}
              <div
                style={{
                  height: 1,
                  margin: '24px 0 20px',
                  background:
                    'linear-gradient(90deg, transparent, rgb(var(--border-rgb) / 0.20), transparent)',
                }}
              />

              {/* Social card — horizontal profile row, wraps on small screens */}
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 18,
                  padding: "18px 22px",
                  marginBottom: 20,
                  borderRadius: 16,
                  border: "1px solid rgb(var(--border-rgb) / 0.12)",
                  background:
                    "radial-gradient(120% 140% at 0% 50%, rgba(168, 85, 247, 0.14), transparent 55%), radial-gradient(120% 140% at 100% 50%, rgba(56, 189, 248, 0.10), transparent 55%), rgb(var(--surface-rgb) / 0.03)",
                  overflow: "hidden",
                }}
              >
                {/* Top gradient hairline */}
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    top: 0,
                    left: "10%",
                    right: "10%",
                    height: 2,
                    borderRadius: 2,
                    background:
                      "linear-gradient(90deg, transparent, #a855f7, #ec4899, #38bdf8, transparent)",
                    opacity: 0.7,
                  }}
                />

                {/* Left: avatar + text — kept together so they wrap as a unit */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    minWidth: 0,
                    flex: "1 1 auto",
                  }}
                >
                  {/* Avatar-style monogram */}
                  <div
                    aria-hidden
                    style={{
                      flex: "0 0 auto",
                      width: 46,
                      height: 46,
                      borderRadius: "50%",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 17,
                      fontWeight: 700,
                      letterSpacing: 0.5,
                      color: "#fff",
                      background:
                        "linear-gradient(135deg, #a855f7 0%, #ec4899 55%, #38bdf8 100%)",
                      boxShadow:
                        "0 8px 24px rgba(168, 85, 247, 0.35), 0 0 0 4px rgba(168, 85, 247, 0.12)",
                    }}
                  >
                    YG
                  </div>

                  {/* Heading + subtitle */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                      minWidth: 0,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        letterSpacing: -0.2,
                        background:
                          "linear-gradient(135deg, #a855f7, #ec4899 55%, #38bdf8)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      Connect with Yogesh
                    </span>
                    <span
                      style={{
                        fontSize: 12.5,
                        fontWeight: 400,
                        color: "var(--text-muted, #64748b)",
                      }}
                    >
                      Follow for updates, releases &amp; new components
                    </span>
                  </div>
                </div>

                {/* Right: social icons */}
                <SocialIcons size={38} />
              </div>

              {/* Bottom row: license + credit */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 16,
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '3px 9px',
                        borderRadius: 6,
                        border: '1px solid rgba(167,139,250,0.35)',
                        background: 'rgba(167,139,250,0.10)',
                        color: '#c4b5fd',
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: '0.06em',
                      }}
                    >
                      MIT
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                      · © 2026 react-next-select
                    </span>
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                    Crafted with <span style={{ color: '#f472b6' }}>♥</span> for the React & Next.js community
                  </div>
                </div>

                <a
                  href="https://github.com/yogeshgabani"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '9px 16px',
                    borderRadius: 999,
                    border: '1px solid rgb(var(--border-rgb) / 0.18)',
                    background: 'rgb(var(--surface-rgb) / 0.04)',
                    color: 'var(--text-muted)',
                    fontSize: 13,
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  Built by{' '}
                  <span
                    style={{
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #a78bfa 0%, #f472b6 50%, #38bdf8 100%)',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      color: 'transparent',
                    }}
                  >
                    Yogesh Gabani
                  </span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M7 17 17 7M9 7h8v8" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* Scroll-to-top button */}
      <button
        type="button"
        aria-label="Scroll to top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 60,
          width: 48,
          height: 48,
          borderRadius: '50%',
          border: 'none',
          cursor: scrolled ? 'pointer' : 'default',
          background: 'linear-gradient(135deg, #a78bfa 0%, #f472b6 50%, #38bdf8 100%)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 10px 30px -8px rgba(167, 139, 250, 0.55), 0 4px 12px -4px rgba(244, 114, 182, 0.35)',
          opacity: scrolled ? 1 : 0,
          transform: scrolled ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.85)',
          pointerEvents: scrolled ? 'auto' : 'none',
          transition:
            'opacity 0.35s ease, transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.25s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)'
          e.currentTarget.style.boxShadow =
            '0 14px 36px -8px rgba(167, 139, 250, 0.7), 0 6px 16px -4px rgba(244, 114, 182, 0.45)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)'
          e.currentTarget.style.boxShadow =
            '0 10px 30px -8px rgba(167, 139, 250, 0.55), 0 4px 12px -4px rgba(244, 114, 182, 0.35)'
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </button>
    </>
  )
}






const SOCIAL_LINKS = [
  {
    key: "whatsapp",
    label: "WhatsApp",
    href: process.env.NEXT_PUBLIC_SOCIAL_WHATSAPP || "",
    brand: "#25D366",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
      </svg>
    ),
  },
  {
    key: "instagram",
    label: "Instagram",
    href: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || "",
    brand: "#E4405F",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.336 3.608 1.311.975.975 1.249 2.242 1.311 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.336 2.633-1.311 3.608-.975.975-2.242 1.249-3.608 1.311-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.336-3.608-1.311-.975-.975-1.249-2.242-1.311-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.336-2.633 1.311-3.608.975-.975 2.242-1.249 3.608-1.311 1.266-.058 1.646-.07 4.85-.07M12 0C8.741 0 8.332.014 7.052.072 5.197.157 3.355.673 2.014 2.014.673 3.355.157 5.197.072 7.052.014 8.332 0 8.741 0 12s.014 3.668.072 4.948c.085 1.855.601 3.697 1.942 5.038 1.341 1.341 3.183 1.857 5.038 1.942C8.332 23.986 8.741 24 12 24s3.668-.014 4.948-.072c1.855-.085 3.697-.601 5.038-1.942 1.341-1.341 1.857-3.183 1.942-5.038.058-1.28.072-1.689.072-4.948s-.014-3.668-.072-4.948c-.085-1.855-.601-3.697-1.942-5.038C20.645.673 18.803.157 16.948.072 15.668.014 15.259 0 12 0Zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324ZM12 16a4 4 0 110-8 4 4 0 010 8Zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881Z" />
      </svg>
    ),
  },
  {
    key: "facebook",
    label: "Facebook",
    href: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK || "",
    brand: "#1877F2",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.019 4.388 11.005 10.125 11.927v-8.437H7.078v-3.49h3.047V9.413c0-3.017 1.792-4.687 4.533-4.687 1.312 0 2.686.235 2.686.235v2.97h-1.514c-1.491 0-1.956.93-1.956 1.886v2.255h3.328l-.532 3.49h-2.796V24C19.612 23.078 24 18.092 24 12.073Z" />
      </svg>
    ),
  },
  {
    key: "youtube",
    label: "YouTube",
    href: process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE || "",
    brand: "#FF0000",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z" />
      </svg>
    ),
  },
  {
    key: "twitter",
    label: "X (Twitter)",
    href: process.env.NEXT_PUBLIC_SOCIAL_TWITTER || "",
    brand: "#0F1419",
    brandDark: "#E7E9EA",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
      </svg>
    ),
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    href: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN || "",
    brand: "#0A66C2",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065Zm1.782 13.019H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
      </svg>
    ),
  },
  {
    key: "github",
    label: "GitHub",
    href: process.env.NEXT_PUBLIC_SOCIAL_GITHUB || "",
    brand: "#24292F",
    brandDark: "#F0F6FC",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23a11.52 11.52 0 013-.405c1.02.005 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12Z" />
      </svg>
    ),
  },
];


function SocialIcons({ size = 36 }) {
  // Page tracks theme on <html data-theme>. Read it from the DOM so this
  // component works without a ThemeProvider, and re-read on toggle.
  const [isDark, setIsDark] = useState(true);
  useEffect(() => {
    const html = document.documentElement;
    const read = () => setIsDark((html.dataset.theme || "dark") === "dark");
    read();
    const obs = new MutationObserver(read);
    obs.observe(html, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);
  const [missing, setMissing] = useState(null);

  // ESC closes the unavailable-link modal
  useEffect(() => {
    if (!missing) return;
    const onKey = (e) => {
      if (e.key === "Escape") setMissing(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [missing]);

  return (
    <>
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {SOCIAL_LINKS.map((s) => {
          const hoverColor = isDark && s.brandDark ? s.brandDark : s.brand;
          const available = Boolean(s.href);
          return (
            <a
              key={s.key}
              href={available ? s.href : "#"}
              target={available ? "_blank" : undefined}
              rel="noreferrer noopener"
              aria-label={available ? s.label : `${s.label} — not available`}
              title={available ? s.label : `${s.label} — not configured yet`}
              onClick={(e) => {
                if (!available) {
                  e.preventDefault();
                  setMissing(s);
                }
              }}
              style={{
                width: size,
                height: size,
                borderRadius: 999,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: "inherit",
                background: "color-mix(in srgb, currentColor 4%, transparent)",
                border:
                  "1px solid color-mix(in srgb, currentColor 12%, transparent)",
                textDecoration: "none",
                transition: "all 180ms ease",
                opacity: available ? 1 : 0.65,
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `color-mix(in srgb, ${hoverColor} 14%, transparent)`;
                e.currentTarget.style.borderColor = `color-mix(in srgb, ${hoverColor} 55%, transparent)`;
                e.currentTarget.style.color = hoverColor;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background =
                  "color-mix(in srgb, currentColor 4%, transparent)";
                e.currentTarget.style.borderColor =
                  "color-mix(in srgb, currentColor 12%, transparent)";
                e.currentTarget.style.color = "inherit";
                e.currentTarget.style.transform = "";
              }}
            >
              {s.icon}
            </a>
          );
        })}
      </div>
      {missing && (
        <SocialUnavailableModal
          social={missing}
          isDark={isDark}
          onClose={() => setMissing(null)}
        />
      )}
    </>
  );
}

function SocialUnavailableModal({
  social,
  isDark,
  onClose,
}) {
  // Use brandDark in dark mode when available — keeps GitHub/Twitter
  // icons (which have near-black brand colors) visible on the dark modal bg.
  const iconColor = isDark && social.brandDark ? social.brandDark : social.brand;
  // Portal target — only available after mount (SSR-safe)
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent body scroll while modal is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  if (!mounted) return null;

  // Render into <body> so the modal escapes any ancestor with
  // backdrop-filter / transform / filter (which would otherwise
  // trap position:fixed inside that ancestor's containing block).
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="rnl-social-modal-title"
      aria-describedby="rnl-social-modal-desc"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0, 0, 0, 0.58)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          maxWidth: 380,
          width: "100%",
          background: "rgb(var(--surface-strong-rgb) / 0.98)",
          color: "var(--text-primary)",
          borderRadius: 16,
          padding: "32px 24px 24px",
          border:
            "1px solid color-mix(in srgb, currentColor 12%, transparent)",
          boxShadow: "0 24px 60px rgba(0, 0, 0, 0.4)",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        {/* Top gradient border */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background:
              "linear-gradient(90deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)",
          }}
        />

        {/* Close X (top-right) */}
        <button
          aria-label="Close"
          onClick={onClose}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            width: 30,
            height: 30,
            borderRadius: 8,
            border: "none",
            background: "transparent",
            color: "inherit",
            cursor: "pointer",
            fontSize: 20,
            lineHeight: 1,
            opacity: 0.55,
            transition: "opacity 160ms, background 160ms",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.background =
              "color-mix(in srgb, currentColor 8%, transparent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "0.55";
            e.currentTarget.style.background = "transparent";
          }}
        >
          ×
        </button>

        {/* Big social icon */}
        <div
          style={{
            width: 64,
            height: 64,
            margin: "0 auto 16px",
            borderRadius: "50%",
            background: `color-mix(in srgb, ${iconColor} 18%, transparent)`,
            border: `1px solid color-mix(in srgb, ${iconColor} 35%, transparent)`,
            color: iconColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              transform: "scale(1.7)",
              transformOrigin: "center",
              lineHeight: 0,
            }}
          >
            {social.icon}
          </span>
        </div>

        <h3
          id="rnl-social-modal-title"
          style={{
            margin: "0 0 8px",
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: "-0.01em",
          }}
        >
          Data Not Available
        </h3>
        <p
          id="rnl-social-modal-desc"
          style={{
            margin: "0 0 20px",
            fontSize: 13,
            color: "var(--text-muted, #94a3b8)",
            lineHeight: 1.55,
          }}
        >
          The <strong style={{ color: "inherit" }}>{social.label}</strong> link
          hasn&apos;t been configured yet. Please check back later.
        </p>

        <button
          onClick={onClose}
          style={{
            padding: "8px 22px",
            borderRadius: 999,
            border: "none",
            background:
              "linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)",
            color: "#fff",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 8px 24px rgba(168, 85, 247, 0.35)",
            transition: "transform 160ms",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "";
          }}
        >
          Got it
        </button>
      </div>
    </div>,
    document.body
  );
}
