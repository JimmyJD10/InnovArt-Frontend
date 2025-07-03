'use client'
import Link from 'next/link'
import { FaFacebook, FaInstagram, FaWhatsapp, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa'

export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-sky-100 to-blue-200">
      {/* Barra de navegación */}
      <nav className="w-full bg-blue-900 shadow-lg flex items-center justify-between px-10 py-4 z-30 sticky top-0 left-0 mb-8">
        <div className="flex items-center gap-12">
          <img src="/logo_innovart_white.png" alt="Logo InnovArt" className="h-12 w-auto drop-shadow-lg" />
          <div className="flex gap-10">
            <Link href="/" className="text-white font-semibold hover:text-blue-300 transition-colors">INICIO</Link>
            <Link href="/artesanos" className="text-white font-semibold hover:text-blue-300 transition-colors">ARTESANOS</Link>
            <Link href="/galeria" className="text-white font-semibold hover:text-blue-300 transition-colors">GALERÍA</Link>
            <Link href="/contacto" className="text-white font-semibold hover:text-blue-300 transition-colors underline">CONTACTO</Link>
          </div>
        </div>
        <div className="flex gap-4">
          <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-blue-300 transition-colors">
            <FaFacebook size={22} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-pink-300 transition-colors">
            <FaInstagram size={22} />
          </a>
          <a href="https://wa.me/1234567890" target="_blank" rel="noreferrer" className="hover:text-green-300 transition-colors">
            <FaWhatsapp size={22} />
          </a>
        </div>
      </nav>
      {/* Formulario de contacto */}
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
        <div className="bg-white/95 rounded-2xl shadow-2xl p-10 max-w-xl w-full">
          <div className="flex flex-col items-center mb-6">
            <img src="/logo_innovart_white.png" alt="Logo InnovArt" className="h-16 mb-2 drop-shadow" />
            <h2 className="text-3xl font-bold text-blue-900 mb-2">Contáctanos</h2>
            <p className="text-blue-800 text-center mb-2">
              ¿Tienes dudas, sugerencias o quieres unirte a la red? Escríbenos y te responderemos lo antes posible.
            </p>
          </div>
          <form className="flex flex-col gap-4">
            <input type="text" placeholder="Nombre" className="border rounded px-3 py-2 focus:outline-blue-400" />
            <input type="email" placeholder="Correo electrónico" className="border rounded px-3 py-2 focus:outline-blue-400" />
            <textarea placeholder="Mensaje" className="border rounded px-3 py-2 focus:outline-blue-400" rows={5}></textarea>
            <button type="submit" className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-6 rounded-full shadow transition">Enviar mensaje</button>
          </form>
          <div className="mt-8 text-blue-700 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <FaEnvelope /> <span>Email: <a href="mailto:contacto@innovart.com" className="underline">contacto@innovart.com</a></span>
            </div>
            <div className="flex items-center gap-2">
              <FaPhone /> <span>Teléfono: <a href="tel:+51987654321" className="underline">+51 987 654 321</a></span>
            </div>
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt /> <span>Perú, Lima</span>
            </div>
          </div>
        </div>
      </div>
      <footer className="w-full bg-blue-900 text-white text-sm py-3 px-6 flex justify-between items-center z-10 relative mt-12">
        <span>&copy; 2025 InnovArt. Todos los derechos reservados.</span>
        <span className="underline hover:text-gray-300 cursor-pointer">Política de privacidad</span>
      </footer>
    </div>
  )
}
