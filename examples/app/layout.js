import 'react-next-select/style.css'
import './globals.css'

export const metadata = {
  title: 'react-next-select — Accessible React Select for Next.js',
  description:
    'A lightweight, SSR-safe, accessible React Select component. Single & multi, async loading, fully customizable.',
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
      <body>{children}</body>
    </html>
  )
}
