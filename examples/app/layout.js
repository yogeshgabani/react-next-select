import 'react-next-select/style.css'

export const metadata = {
  title: 'react-next-select demo',
  description: 'Next.js + react-next-select (local package)',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif' }}>{children}</body>
    </html>
  )
}
