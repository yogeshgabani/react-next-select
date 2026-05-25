'use client'

import { useCallback, useEffect, useState } from 'react'
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
  { name: 'Purple',  rgb: '167 139 250', hex: '#a78bfa' },
  { name: 'Indigo',  rgb: '129 140 248', hex: '#818cf8' },
  { name: 'Blue',    rgb: '56 189 248',  hex: '#38bdf8' },
  { name: 'Emerald', rgb: '52 211 153',  hex: '#34d399' },
  { name: 'Amber',   rgb: '251 191 36',  hex: '#fbbf24' },
  { name: 'Rose',    rgb: '244 114 182', hex: '#f472b6' },
]

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
          Mix and match props — the snippet on the right updates as you go.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
          gap: 24,
          alignItems: 'start',
        }}
      >
        {/* Left — controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 4,
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

        {/* Right — Live preview + snippet */}
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
                  border: `1px solid ${
                    copied ? 'rgba(34, 197, 94, 0.4)' : 'rgb(var(--rns-accent) / 0.5)'
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
                    border: `1px solid ${
                      active ? p.hex : 'rgb(var(--border-rgb) / 0.12)'
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
                border: `1px solid ${
                  copied ? 'rgba(34, 197, 94, 0.4)' : 'rgb(var(--rns-accent) / 0.5)'
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

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode)
  }, [mode])

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
      {/* Sticky Nav */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgb(var(--nav-rgb) / 0.75)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgb(var(--border-rgb) / 0.08)',
          transition: 'background 0.3s, border-color 0.3s',
        }}
      >
        <div
          className="rns-demo__nav-row"
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            <div
              style={{
                width: 32,
                height: 32,
                flexShrink: 0,
                borderRadius: 8,
                background: 'linear-gradient(135deg, #a78bfa, #ec4899)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                color: '#fff',
              }}
            >
              R
            </div>
            <span
              className="rns-demo__brand-text"
              style={{
                fontWeight: 700,
                fontSize: 16,
                color: 'var(--text-primary)',
                whiteSpace: 'nowrap',
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

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 24px 80px' }}>
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
                        border: `1px solid ${
                          isCopied ? 'rgba(34, 197, 94, 0.4)' : 'rgb(var(--rns-accent) / 0.5)'
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
                        border: `1px solid ${
                          active
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

        {/* Footer */}
        <footer
          style={{
            marginTop: 80,
            padding: '32px 0 0',
            borderTop: '1px solid rgb(var(--border-rgb) / 0.06)',
            textAlign: 'center',
            color: 'var(--text-soft)',
            fontSize: 13,
          }}
        >
          <p style={{ margin: '0 0 8px' }}>
            Built with ❤️ by{' '}
            <a
              href="https://github.com/yogeshgabani"
              target="_blank"
              rel="noreferrer"
              style={{ color: '#a78bfa', fontWeight: 600 }}
            >
              Yogesh Gabani
            </a>
          </p>
          <p style={{ margin: 0 }}>MIT Licensed · Made for the React & Next.js community</p>
        </footer>
      </main>
    </>
  )
}
