import { ImageResponse } from 'next/og'

// Social preview card (og:image) — Next.js renders this to a 1200×630 PNG at
// build time and wires up the og:image / og:image:width / og:image:alt tags.
// twitter-image.js re-uses it for X/Twitter's summary_large_image card.

export const alt =
  'react-next-select — the accessible, SSR-safe Select component built for Next.js'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const VERSION = '0.5.0'
const FONT_CSS_URL =
  'https://fonts.googleapis.com/css2?family=Inter:wght@500;700;800&family=JetBrains+Mono:wght@500'

// Satori (the renderer behind ImageResponse) needs TTF/OTF, which Google Fonts
// serves to plain non-browser clients. If the fetch fails the image still
// renders with the built-in fallback font instead of breaking the build.
async function loadFonts() {
  try {
    const css = await (await fetch(FONT_CSS_URL)).text()
    const faces = [...css.matchAll(/@font-face\s*{([^}]+)}/g)].map(([, block]) => ({
      name: block.match(/font-family:\s*'([^']+)'/)?.[1],
      weight: Number(block.match(/font-weight:\s*(\d+)/)?.[1]),
      url: block.match(/src:\s*url\(([^)]+)\)\s*format\('(?:truetype|opentype)'\)/)?.[1],
    }))
    return await Promise.all(
      faces
        .filter((f) => f.name && f.url)
        .map(async (f) => ({
          name: f.name,
          weight: f.weight,
          style: 'normal',
          data: await (await fetch(f.url)).arrayBuffer(),
        })),
    )
  } catch {
    return []
  }
}

const ACCENT = '167, 139, 250'
const GRADIENT = 'linear-gradient(90deg, #a78bfa, #ec4899 55%, #38bdf8)'

function Check() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 12.5l4.5 4.5L19 7.5"
        stroke="#c4b5fd"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Chip({ children }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 10px 6px 12px',
        borderRadius: 8,
        background: `rgba(${ACCENT}, 0.25)`,
        border: `1px solid rgba(${ACCENT}, 0.4)`,
        color: '#ede9fe',
        fontSize: 18,
        fontWeight: 500,
      }}
    >
      {children}
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
        <path d="M6 6l12 12M18 6L6 18" stroke="#c4b5fd" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </div>
  )
}

function Option({ label, selected, focused }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '11px 14px',
        borderRadius: 8,
        fontSize: 19,
        fontWeight: selected ? 700 : 500,
        color: selected ? '#f8fafc' : '#cbd5e1',
        background: selected
          ? `rgba(${ACCENT}, 0.22)`
          : focused
            ? 'rgba(255, 255, 255, 0.07)'
            : 'transparent',
      }}
    >
      {label}
      {selected && <Check />}
    </div>
  )
}

/** A static picture of an open multi-select, styled like the real component. */
function SelectMock() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: 400 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 60,
          padding: '0 14px 0 12px',
          borderRadius: 12,
          background: `rgba(${ACCENT}, 0.08)`,
          border: `1.5px solid rgba(${ACCENT}, 0.75)`,
          boxShadow: `0 0 0 4px rgba(${ACCENT}, 0.18)`,
        }}
      >
        <div style={{ display: 'flex', gap: 8 }}>
          <Chip>Next.js</Chip>
          <Chip>Vite</Chip>
        </div>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M6 15l6-6 6 6"
            stroke="#a78bfa"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          marginTop: 10,
          padding: 6,
          borderRadius: 12,
          background: 'rgba(15, 23, 42, 0.96)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.6)',
        }}
      >
        <Option label="Next.js" selected />
        <Option label="Vite" selected />
        <Option label="Webpack" focused />
        <Option label="Esbuild" />
        <Option label="Bun" />
      </div>
    </div>
  )
}

export default async function OpengraphImage() {
  const fonts = await loadFonts()

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          padding: '56px 72px',
          fontFamily: 'Inter',
          color: '#f8fafc',
          backgroundColor: '#0b1020',
          backgroundImage: [
            `radial-gradient(circle at 8% 0%, rgba(${ACCENT}, 0.30), transparent 45%)`,
            'radial-gradient(circle at 100% 20%, rgba(56, 189, 248, 0.20), transparent 45%)',
            'radial-gradient(circle at 50% 120%, rgba(236, 72, 153, 0.20), transparent 50%)',
          ].join(', '),
        }}
      >
        {/* Brand row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 7,
                width: 64,
                height: 42,
                borderRadius: 12,
                background: `rgba(${ACCENT}, 0.12)`,
                border: `1px solid rgba(${ACCENT}, 0.3)`,
              }}
            >
              <div style={{ width: 10, height: 10, borderRadius: 5, background: '#a78bfa' }} />
              <div style={{ width: 10, height: 10, borderRadius: 5, background: '#f472b6' }} />
              <div style={{ width: 10, height: 10, borderRadius: 5, background: '#38bdf8' }} />
            </div>
            <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: -0.5 }}>
              react-next-select
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              padding: '8px 16px',
              borderRadius: 999,
              fontSize: 20,
              fontWeight: 700,
              color: '#c4b5fd',
              background: `rgba(${ACCENT}, 0.15)`,
              border: `1px solid rgba(${ACCENT}, 0.4)`,
            }}
          >
            v{VERSION}
          </div>
        </div>

        {/* Headline + mock */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexDirection: 'column', width: 600 }}>
            <div
              style={{
                display: 'flex',
                fontSize: 66,
                fontWeight: 800,
                lineHeight: 1.08,
                letterSpacing: -2,
                backgroundImage: GRADIENT,
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              The Select component
            </div>
            <div
              style={{ display: 'flex', fontSize: 66, fontWeight: 800, lineHeight: 1.08, letterSpacing: -2 }}
            >
              built for Next.js
            </div>
            <div
              style={{
                display: 'flex',
                marginTop: 24,
                fontSize: 26,
                lineHeight: 1.45,
                color: '#94a3b8',
              }}
            >
              Accessible, SSR-safe and themeable with one prop. Single & multi, async, grouped,
              creatable.
            </div>
          </div>
          <SelectMock />
        </div>

        {/* Install + highlights */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '14px 22px',
              borderRadius: 12,
              fontFamily: 'JetBrains Mono',
              fontSize: 22,
              fontWeight: 500,
              color: '#e2e8f0',
              background: 'rgba(2, 6, 23, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <span style={{ color: '#a78bfa' }}>$</span>
            npm install react-next-select
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {['Zero deps', 'TypeScript', 'React 18 & 19'].map((label) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  padding: '9px 16px',
                  borderRadius: 999,
                  fontSize: 19,
                  fontWeight: 500,
                  color: '#cbd5e1',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts },
  )
}
