'use client'

import Link from 'next/link'
import { FaUserCircle, FaUserTie, FaUser, FaInstagram, FaFacebook, FaWhatsapp, FaCertificate, FaStar, FaUserShield, FaMapMarkerAlt, FaEdit, FaCamera } from 'react-icons/fa'
import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

type User = {
  id: number
  nombre_completo: string
  correo: string
  foto_perfil?: string
  telefono?: string
  genero?: string
  fecha_nacimiento?: string
  direccion?: string
  ciudad?: string
  pais?: string
  fecha_registro?: string
  rol: 'artesano' | 'cliente' | 'admin'
  descripcion?: string
  especialidades?: string
  portafolio?: string
  redes_sociales?: string
  calificacion_promedio?: number
  total_reseñas?: number
  disponibilidad?: string
  metodos_pago_aceptados?: string
  ubicacion_precisa?: string
  certificaciones?: string
  experiencia_anios?: number
  favoritos?: string
}

export default function PerfilPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [editUser, setEditUser] = useState<User | null>(null)
  const [msg, setMsg] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      setLoading(false);
      setUser(null);
      router.replace('/login'); // Redirige automáticamente si no hay sesión
      return;
    }
    axios.get('http://3.147.68.195:3001/api/users/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setUser(res.data);
        setEditUser(res.data);
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setLoading(false);
        router.replace('/login'); // Redirige si el token es inválido
      });
  }, [router])

  // Manejo de edición de campos
  const handleEditChange = (e: any) => {
    setEditUser({ ...editUser!, [e.target.name]: e.target.value })
  }

  // Guardar cambios de perfil
  const handleSave = async () => {
    if (!editUser) return
    setMsg('')
    const token = localStorage.getItem('token')
    try {
      await axios.put(`http://3.147.68.195:3001/api/users/${editUser.id}`, editUser, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUser(editUser)
      setEditMode(false)
      setMsg('Perfil actualizado correctamente')
      localStorage.setItem('user', JSON.stringify(editUser))
    } catch {
      setMsg('Error al actualizar perfil')
    }
  }

  // Subir foto de perfil (simulado, solo URL)
  const handleFotoClick = () => {
    fileInputRef.current?.click()
  }
  const handleFotoChange = (e: any) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    // Simulación: subir a un servicio real y obtener URL
    const reader = new FileReader()
    reader.onloadend = () => {
      setEditUser({ ...editUser!, foto_perfil: reader.result as string })
      setUploading(false)
    }
    reader.readAsDataURL(file)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-white via-sky-100 to-blue-200">
        <span className="text-blue-900 font-semibold">Cargando perfil...</span>
      </div>
    )
  }

  if (!user) {
    // Ya no muestra mensaje, solo retorna null porque router.replace('/login') ya redirige
    return null
  }

  // Parse campos JSON si existen
  let portafolio: string[] = []
  let redes: any = {}
  let especialidades: string[] = []
  let metodosPago: string[] = []
  let certificaciones: string[] = []

  try { portafolio = user.portafolio ? JSON.parse(user.portafolio) : [] } catch {}
  try { redes = user.redes_sociales ? JSON.parse(user.redes_sociales) : {} } catch {}
  try { especialidades = user.especialidades ? user.especialidades.split(',') : [] } catch {}
  try { metodosPago = user.metodos_pago_aceptados ? user.metodos_pago_aceptados.split(',') : [] } catch {}
  try { certificaciones = user.certificaciones ? JSON.parse(user.certificaciones) : [] } catch {}

  // Barra de navegación superior
  const Navbar = () => (
    <nav className="w-full bg-blue-900 shadow-lg flex items-center justify-between px-10 py-4 z-30 sticky top-0 left-0 mb-8">
      <div className="flex items-center gap-12">
        <img src="/logo_innovart_white.png" alt="Logo InnovArt" className="h-12 w-auto drop-shadow-lg" />
        <div className="flex gap-10">
          <Link href="/" className="text-white font-semibold hover:text-blue-300 transition-colors">INICIO</Link>
          <Link href="/artesanos" className="text-white font-semibold hover:text-blue-300 transition-colors">ARTESANOS</Link>
          <Link href="/galeria" className="text-white font-semibold hover:text-blue-300 transition-colors">GALERÍA</Link>
          <Link href="/contacto" className="text-white font-semibold hover:text-blue-300 transition-colors">CONTACTO</Link>
        </div>
      </div>
      <div>
        <Link href="/perfil" className="flex items-center text-white font-semibold hover:text-blue-300 transition-colors">
          PERFIL <FaUserCircle className="ml-2" size={24} />
        </Link>
      </div>
    </nav>
  )

  return (
    <div className="flex flex-col items-center py-0 bg-gradient-to-br from-white via-sky-100 to-blue-200 min-h-[60vh]">
      <Navbar />
      <div className="bg-white/95 rounded-2xl shadow-2xl p-10 flex flex-col items-center max-w-3xl w-full relative">
        {/* Botón editar */}
        {!editMode && (
          <button
            className="absolute top-6 right-6 flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-full shadow transition"
            onClick={() => { setEditMode(true); setEditUser(user); setMsg('') }}
          >
            <FaEdit /> Editar perfil
          </button>
        )}
        {/* Foto y nombre */}
        <div className="relative group mb-2">
          <img
            src={editMode ? (editUser?.foto_perfil || '/default-profile.png') : (user.foto_perfil || '/default-profile.png')}
            alt={user.nombre_completo}
            className="h-32 w-32 rounded-full object-cover border-4 border-blue-200 shadow-lg"
          />
          {editMode && (
            <>
              <button
                className="absolute bottom-2 right-2 bg-blue-700 hover:bg-blue-800 text-white p-2 rounded-full shadow-lg transition"
                onClick={handleFotoClick}
                title="Cambiar foto"
                type="button"
              >
                <FaCamera />
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFotoChange}
              />
            </>
          )}
        </div>
        {/* Nombre editable */}
        {editMode ? (
          <input
            name="nombre_completo"
            value={editUser?.nombre_completo || ''}
            onChange={handleEditChange}
            className="text-3xl font-extrabold text-blue-900 mb-1 text-center border-b-2 border-blue-200 focus:outline-none focus:border-blue-700 bg-transparent"
            style={{ maxWidth: 320 }}
          />
        ) : (
          <h2 className="text-3xl font-extrabold text-blue-900 mb-1 flex items-center gap-2">
            {user.nombre_completo}
            {user.rol === 'artesano' ? (
              <FaUserTie className="text-blue-700" title="Artesano" />
            ) : user.rol === 'admin' ? (
              <FaUserShield className="text-red-600" title="Administrador" />
            ) : (
              <FaUser className="text-yellow-600" title="Cliente" />
            )}
          </h2>
        )}
        <div className="text-blue-700 mb-2">{user.correo}</div>
        {/* Datos principales */}
        <div className="flex flex-wrap gap-4 justify-center mb-6">
          {(editMode ? editUser?.ciudad : user.ciudad) && (
            <span className="flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full text-blue-800 text-sm">
              <FaMapMarkerAlt /> {editMode ? editUser?.ciudad : user.ciudad}{user.pais ? `, ${user.pais}` : ''}
            </span>
          )}
          {(editMode ? editUser?.telefono : user.telefono) && (
            <span className="bg-blue-50 px-3 py-1 rounded-full text-blue-800 text-sm">
              Tel: {editMode ? editUser?.telefono : user.telefono}
            </span>
          )}
          {(editMode ? editUser?.genero : user.genero) && (
            <span className="bg-blue-50 px-3 py-1 rounded-full text-blue-800 text-sm">
              {editMode ? editUser?.genero : user.genero}
            </span>
          )}
          {(editMode ? editUser?.fecha_nacimiento : user.fecha_nacimiento) && (
            <span className="bg-blue-50 px-3 py-1 rounded-full text-blue-800 text-sm">
              Nac.: {(editMode ? editUser?.fecha_nacimiento : user.fecha_nacimiento)?.slice(0,10)}
            </span>
          )}
          {user.fecha_registro && (
            <span className="bg-blue-50 px-3 py-1 rounded-full text-blue-800 text-sm">
              Miembro desde {user.fecha_registro.slice(0,10)}
            </span>
          )}
        </div>
        {/* Rol y estado */}
        <div className="mb-4 flex flex-wrap gap-4 justify-center">
          <span className={`px-4 py-1 rounded-full font-bold text-white ${user.rol === 'artesano' ? 'bg-blue-700' : user.rol === 'admin' ? 'bg-red-600' : 'bg-yellow-400 text-blue-900'}`}>
            {user.rol === 'artesano' ? 'Artesano' : user.rol === 'admin' ? 'Administrador' : 'Cliente'}
          </span>
          {user.disponibilidad && (
            <span className={`px-4 py-1 rounded-full font-bold ${user.disponibilidad === 'Disponible' ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'}`}>
              {user.disponibilidad}
            </span>
          )}
        </div>
        {/* Sección Artesano */}
        {user.rol === 'artesano' && (
          <div className="w-full mt-6">
            {/* Calificación y reseñas */}
            <div className="flex flex-wrap gap-4 items-center justify-center mb-4">
              <span className="flex items-center gap-1 text-yellow-600 font-bold text-lg">
                <FaStar /> {typeof user.calificacion_promedio === 'number'
                  ? user.calificacion_promedio.toFixed(1)
                  : '0.0'} / 5
              </span>
              <span className="text-blue-800">{user.total_reseñas || 0} reseñas</span>
              {typeof user.experiencia_anios === 'number' && user.experiencia_anios > 0 && (
                <span className="text-blue-800">{user.experiencia_anios} años de experiencia</span>
              )}
            </div>
            {/* Descripción */}
            {editMode ? (
              <textarea
                name="descripcion"
                value={editUser?.descripcion || ''}
                onChange={handleEditChange}
                className="mb-4 text-blue-900 text-lg text-center italic px-4 border rounded w-full"
                rows={2}
                placeholder="Descripción"
              />
            ) : user.descripcion && (
              <div className="mb-4 text-blue-900 text-lg text-center italic px-4">{user.descripcion}</div>
            )}
            {/* Especialidades */}
            {editMode ? (
              <input
                name="especialidades"
                value={editUser?.especialidades || ''}
                onChange={handleEditChange}
                className="mb-4 border rounded px-3 py-1 w-full text-center"
                placeholder="Especialidades (separadas por coma)"
              />
            ) : especialidades.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2 justify-center">
                {especialidades.map((e, i) => (
                  <span key={i} className="bg-blue-100 px-3 py-1 rounded-full text-blue-900 text-sm">{e.trim()}</span>
                ))}
              </div>
            )}
            {/* Portafolio */}
            {portafolio.length > 0 && (
              <div className="mb-6">
                <h4 className="font-bold text-blue-900 mb-2 text-center">Portafolio</h4>
                <div className="flex flex-wrap gap-3 justify-center">
                  {portafolio.map((url, i) => (
                    <img key={i} src={url} alt={`Portafolio ${i+1}`} className="h-20 w-20 object-cover rounded shadow border-2 border-blue-100" />
                  ))}
                </div>
              </div>
            )}
            {/* Redes sociales */}
            {redes && (redes.facebook || redes.instagram || redes.whatsapp) && (
              <div className="mb-4 flex gap-6 justify-center">
                {redes.facebook && <a href={redes.facebook} target="_blank" rel="noopener noreferrer"><FaFacebook className="text-blue-700" size={28} /></a>}
                {redes.instagram && <a href={redes.instagram} target="_blank" rel="noopener noreferrer"><FaInstagram className="text-pink-500" size={28} /></a>}
                {redes.whatsapp && <a href={redes.whatsapp} target="_blank" rel="noopener noreferrer"><FaWhatsapp className="text-green-500" size={28} /></a>}
              </div>
            )}
            {/* Métodos de pago */}
            {metodosPago.length > 0 && (
              <div className="mb-2 text-blue-800 text-center">
                <b>Métodos de pago:</b> {metodosPago.join(', ')}
              </div>
            )}
            {/* Certificaciones */}
            {certificaciones.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-2 justify-center">
                <b className="text-blue-900">Certificaciones:</b>
                {certificaciones.map((c, i) => (
                  <span key={i} className="flex items-center gap-1 bg-blue-100 px-2 py-0.5 rounded text-blue-900 text-xs"><FaCertificate /> {c}</span>
                ))}
              </div>
            )}
            {/* Ubicación precisa */}
            {user.ubicacion_precisa && (
              <div className="mb-2 text-blue-800 text-center">
                <b>Ubicación precisa:</b> {user.ubicacion_precisa}
              </div>
            )}
          </div>
        )}
        {/* Sección Cliente */}
        {user.rol === 'cliente' && (
          <div className="w-full mt-6">
            <h3 className="text-lg font-bold text-blue-900 mb-2 flex items-center gap-2">
              <FaUser /> Perfil Cliente
            </h3>
            <div className="text-blue-800 mb-2">¡Gracias por ser parte de InnovArt! Puedes agregar productos y artesanos a tus favoritos y realizar pedidos.</div>
            {/* Favoritos */}
            {user.favoritos && (
              <div className="mb-2 text-blue-800">
                <b>Favoritos:</b> {JSON.parse(user.favoritos).length} elementos
              </div>
            )}
          </div>
        )}
        {/* Sección Admin */}
        {user.rol === 'admin' && (
          <div className="w-full mt-6">
            <h3 className="text-lg font-bold text-red-700 mb-2 flex items-center gap-2">
              <FaUserShield /> Perfil Administrador
            </h3>
            <div className="mb-2 text-blue-800">
              Tienes acceso total para gestionar usuarios, productos, mensajes y contenido de la plataforma.
            </div>
          </div>
        )}
        {/* Botones guardar/cancelar en modo edición */}
        {editMode && (
          <div className="flex gap-4 mt-6">
            <button
              onClick={handleSave}
              className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-6 rounded-full shadow transition"
              disabled={uploading}
            >
              {uploading ? 'Subiendo foto...' : 'Guardar cambios'}
            </button>
            <button
              onClick={() => { setEditMode(false); setEditUser(user); setMsg(''); }}
              className="bg-gray-300 hover:bg-gray-400 text-blue-900 font-bold py-2 px-6 rounded-full shadow transition"
              disabled={uploading}
            >
              Cancelar
            </button>
          </div>
        )}
        {msg && <div className="text-green-700 mt-4">{msg}</div>}
      </div>
    </div>
  )
}