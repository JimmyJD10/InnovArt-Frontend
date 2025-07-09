'use client'
import Link from 'next/link'
import { FaUserCircle, FaHome, FaBoxOpen, FaUserFriends, FaBell, FaShoppingCart, FaSignInAlt } from 'react-icons/fa'

export default function Navbar() {
  return (
    <nav className="w-full bg-gradient-to-r from-blue-900 via-blue-700 to-blue-400 shadow-lg flex items-center justify-between px-8 py-4 z-30 sticky top-0 left-0 animate-navbar-fade">
      <div className="flex items-center gap-10">
        <Link href="/" className="flex items-center gap-2 text-white font-extrabold text-2xl drop-shadow hover:scale-105 transition-transform">
          <img src="/logo_innovart_white.png" alt="Logo InnovArt" className="h-10 w-auto drop-shadow" />
          InnovArt
        </Link>
        <div className="hidden md:flex gap-8 ml-8">
          <Link href="/" className="flex items-center gap-2 text-white font-semibold hover:text-blue-200 transition-colors">
            <FaHome /> Inicio
          </Link>
          <Link href="/artesanos" className="flex items-center gap-2 text-white font-semibold hover:text-blue-200 transition-colors">
            <FaUserFriends /> Artesanos
          </Link>
          <Link href="/productos" className="flex items-center gap-2 text-white font-semibold hover:text-blue-200 transition-colors">
            <FaBoxOpen /> Productos
          </Link>
          <Link href="/galeria" className="flex items-center gap-2 text-white font-semibold hover:text-blue-200 transition-colors">
            <FaBoxOpen /> Galería
          </Link>
          <Link href="/notificaciones" className="flex items-center gap-2 text-white font-semibold hover:text-blue-200 transition-colors">
            <FaBell /> Notificaciones
          </Link>
          <Link href="/carrito" className="flex items-center gap-2 text-white font-semibold hover:text-blue-200 transition-colors">
            <FaShoppingCart /> Carrito
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <Link href="/perfil" className="flex items-center gap-2 text-white font-semibold hover:text-blue-200 transition-colors">
          <FaUserCircle /> Perfil
        </Link>
        <Link href="/login" className="flex items-center gap-2 text-white font-semibold hover:text-blue-200 transition-colors">
          <FaSignInAlt /> Ingresar
        </Link>
      </div>
      <style jsx>{`
        .animate-navbar-fade {
          animation: navbar-fade 1.2s;
        }
        @keyframes navbar-fade {
          from { opacity: 0; transform: translateY(-30px);}
          to { opacity: 1; transform: translateY(0);}
        }
      `}</style>
    </nav>
  )
}
