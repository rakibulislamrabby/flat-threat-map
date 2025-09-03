import '../styles/globals.css'

export const metadata = {
  title: 'Threat Map - Real-time Threat Visualization',
  description: 'Interactive threat map showing global cybersecurity events in real-time',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 min-h-screen">{children}</body>
    </html>
  )
}
