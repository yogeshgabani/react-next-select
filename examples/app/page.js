'use client'

import { useCallback, useState } from 'react'
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

function loadOptions(input) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const q = input.trim().toLowerCase()
      resolve(
        STATIC_OPTIONS.filter((o) =>
          o.label.toLowerCase().includes(q),
        ),
      )
    }, 400)
  })
}

export default function Page() {
  const [single, setSingle] = useState(null)
  const [multi, setMulti] = useState([])

  const customOption = useCallback((props) => {
    const { innerProps, data } = props
    return (
      <div
        {...innerProps}
        style={{
          padding: '10px 12px',
          cursor: 'pointer',
          borderBottom: '1px solid #eee',
          background: props.isFocused ? '#f0f9ff' : '#fff',
        }}
      >
        <strong>{data.label}</strong>
        <span style={{ color: '#64748b', marginLeft: 8 }}>({data.value})</span>
      </div>
    )
  }, [])

  return (
    <main style={{ maxWidth: 640, margin: '40px auto', padding: 24 }}>
      <h1 style={{ marginTop: 0 }}>react-select in Next.js</h1>
      <p style={{ color: '#475569' }}>
        Client component demo (App Router). Default styles are imported in{' '}
        <code>app/layout.js</code>.
      </p>

      <section style={{ marginBottom: 32 }}>
        <h2>Single · searchable · clearable</h2>
        <Select
          options={STATIC_OPTIONS}
          value={single}
          onChange={setSingle}
          isClearable
          placeholder="Pick a bundler…"
          className="demo-select"
          showMenuSearchInput
          styles={{
            control: (base, state) => ({
              ...base,
              borderColor: state.isFocused ? "#6d28d9" : "#c4b5fd",
              background: "#faf5ff",
              boxShadow: state.isFocused ? "0 0 0 2px rgba(109,40,217,0.25)" : "none",
              borderRadius: 10,
            }),
            menu: (base) => ({
              ...base,
              border: "1px solid #ddd6fe",
              borderRadius: 10,
              background: "#fff",
            }),
            option: (base, state) => ({
              ...base,
              background: state.isSelected ? "#ede9fe" : state.isFocused ? "#f5f3ff" : "#fff",
              color: state.isSelected ? "#5b21b6" : "#111827",
            }),
            multiValue: (base) => ({
              ...base,
              background: "#ede9fe",
              color: "#4c1d95",
            }),
            menuSearchWrap: (base) => ({
              ...base,
              background: "#f8fafc",
              borderBottom: "1px solid #ddd6fe",
            }),
            menuSearchInputWrap: (base, state) => ({
              ...base,
              border: state.isFocused ? "1px solid #6d28d9" : "1px solid #c4b5fd",
              background: "#ffffff",
              boxShadow: state.isFocused ? "0 0 0 2px rgba(109,40,217,0.25)" : "none",
            }),
            menuSearchInput: (base) => ({
              ...base,
              color: "#1f2937",
            }),
            menuSearchIcon: (base) => ({
              ...base,
              color: "#7c3aed",
            }),
            menuSearchClear: (base) => ({
              ...base,
              color: "#7c3aed",
            }),
          }}
        />
        <pre
          style={{
            marginTop: 12,
            padding: 12,
            background: '#0f172a',
            color: '#e2e8f0',
            borderRadius: 8,
            fontSize: 13,
            overflow: 'auto',
          }}
        >
          {JSON.stringify(single, null, 2)}
        </pre>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2>Multi-select</h2>
        <Select
          options={STATIC_OPTIONS}
          value={multi}
          onChange={setMulti}
          isMulti
          isClearable
          closeMenuOnSelect={false}
          placeholder="Choose several…"
        />
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2>Menu with Search Input</h2>
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
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2>Async options</h2>
        <Select
          loadOptions={loadOptions}
          defaultOptions
          placeholder="Type to search (simulated delay)…"
          onChange={setSingle}
          value={single}
        />
      </section>

      <section>
        <h2>Custom Option component</h2>
        <Select
          options={STATIC_OPTIONS}
          components={{ Option: customOption }}
          onChange={setSingle}
          value={single}
          menuPlacement="top"
        />
      </section>
    </main>
  )
}
