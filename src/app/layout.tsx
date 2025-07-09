import './globals.css'
import Navbar from '../components/Navbar'

export const metadata = {
  title: 'InnovArt',
  description: 'Red Social y Marketplace de Artesanos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="bg-gradient-to-br from-white via-sky-100 to-blue-200 min-h-screen">
        <Navbar />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  )
}
