import 'react-next-select/style.css'
import './globals.css'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://react-next-select.netlify.app'
const TITLE = 'react-next-select — Accessible React Select for Next.js'
const DESCRIPTION =
  'A lightweight, SSR-safe, accessible React Select component. Single & multi, async loading, fully customizable.'

// og:image and twitter:image come from app/opengraph-image.js and
// app/twitter-image.js; metadataBase turns their paths into absolute URLs.
export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  applicationName: 'react-next-select',
  authors: [{ name: 'Yogesh Gabani', url: 'https://github.com/yogeshgabani' }],
  keywords: ['react select', 'next.js select', 'multi-select', 'combobox', 'accessible dropdown'],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'react-next-select',
    title: TITLE,
    description: DESCRIPTION,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
