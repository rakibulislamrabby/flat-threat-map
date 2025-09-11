import '../styles/globals.css'

export const metadata = {
  title: 'World Map - D3 + TopoJSON',
  description: 'Interactive world map built with D3.js and TopoJSON',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">{children}</body>
    </html>
  )
}
