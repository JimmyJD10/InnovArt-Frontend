'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Link from 'next/link'
import { FaUserTie, FaStar, FaBoxOpen, FaCog, FaEdit, FaKey, FaSignOutAlt, FaPlus, FaStore } from 'react-icons/fa'

export default function PerfilArtesano() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [productos, setProductos] = useState<any[]>([])
  const [resenas, setResenas] = useState<any[]>([])
  const [tab, setTab] = useState('profesional')
  const [msg, setMsg] = useState('')
  const [mensajes, setMensajes] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      setUser(null)
      router.replace('/login')
      return
    }
    axios.get('http://3.148.112.19:3001/api/users/me', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      if (res.data.rol !== 'artesano') {
        router.replace('/perfil')
        return
      }
      setUser(res.data)
      setLoading(false)
    }).catch(() => {
      setLoading(false)
      setUser(null)
      router.replace('/login')
    })
  }, [router])

  useEffect(() => {
    if (user?.id) {
      axios.get('http://3.148.112.19:3001/api/products?usuarioId=' + user.id)
        .then(res => setProductos(res.data || []))
      axios.get('http://3.148.112.19:3001/api/reviews?artesanoId=' + user.id)
        .then(res => setResenas(res.data))
        .catch(() => setResenas([]))
    }
  }, [user])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (user?.id) {
      axios.get('http://3.148.112.19:3001/api/mensajes?destinatarioId=' + user.id, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => setMensajes(res.data))
    }
  }, [user])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.replace('/login')
  }

  const handleChange = (e: any) => {
    setUser({ ...user, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    const token = localStorage.getItem('token')
    await axios.put(`http://3.148.112.19:3001/api/users/${user.id}`, user, {
      headers: { Authorization: `Bearer ${token}` }
    })
    setMsg('Perfil actualizado correctamente')
    localStorage.setItem('user', JSON.stringify(user))
  }

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]">Cargando perfil...</div>
  if (!user) return null

  let especialidades: string[] = []
  try { especialidades = user.especialidades ? user.especialidades.split(',') : [] } catch {}
  let portafolio: string[] = []
  try { portafolio = user.portafolio ? JSON.parse(user.portafolio) : [] } catch {}

  return (
    <div className="flex flex-col items-center py-8 bg-gradient-to-br from-white via-sky-100 to-blue-200 min-h-[60vh]">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">Perfil de Artesano</h1>
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center mb-6 w-full max-w-xl">
          <img src={user.foto_perfil || '/default-profile.png'} alt={user.nombre_completo} className="h-32 w-32 rounded-full object-cover border-4 border-blue-200 shadow-lg mb-2" />
          <h2 className="text-2xl font-bold text-blue-900 mb-1 flex items-center gap-2">
            {user.nombre_completo}
            <FaUserTie className="text-blue-700" title="Artesano" />
          </h2>
          <div className="text-blue-700 mb-1">{user.correo}</div>
          <div className="text-blue-700 mb-1">{user.telefono || <span className="italic text-gray-400">Sin teléfono</span>}</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <div className="flex gap-4 mb-4">
            <button className={`px-4 py-2 rounded-full font-semibold ${tab === 'profesional' ? 'bg-blue-700 text-white' : 'bg-blue-100 text-blue-900'}`} onClick={() => setTab('profesional')}>Profesional</button>
            <button className={`px-4 py-2 rounded-full font-semibold ${tab === 'productos' ? 'bg-blue-700 text-white' : 'bg-blue-100 text-blue-900'}`} onClick={() => setTab('productos')}>Mis Productos</button>
            <button className={`px-4 py-2 rounded-full font-semibold ${tab === 'resenas' ? 'bg-blue-700 text-white' : 'bg-blue-100 text-blue-900'}`} onClick={() => setTab('resenas')}>Reseñas</button>
            <button className={`px-4 py-2 rounded-full font-semibold ${tab === 'config' ? 'bg-blue-700 text-white' : 'bg-blue-100 text-blue-900'}`} onClick={() => setTab('config')}>Configuración</button>
          </div>
          {tab === 'profesional' && (
            <div>
              <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2"><FaUserTie /> Información Profesional</h3>
              <div className="mb-2 text-blue-800">{user.descripcion}</div>
              <div className="mb-2 flex flex-wrap gap-2">
                {especialidades.map((e, i) => (
                  <span key={i} className="bg-blue-100 px-3 py-1 rounded-full text-blue-900 text-sm">{e.trim()}</span>
                ))}
              </div>
              <div className="mb-2 flex items-center gap-2">
                <FaStar className="text-yellow-500" /> <span className="font-bold">{user.calificacion_promedio?.toFixed(1) || '0.0'}</span>
                <span className="text-blue-700">({user.total_reseñas || 0} reseñas)</span>
              </div>
              <div className="mb-2 flex items-center gap-2">
                <FaBoxOpen /> <span className="text-blue-700">{productos.length} productos publicados</span>
              </div>
              <div className="mb-2">
                <b className="text-blue-900">Portafolio:</b>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {portafolio.length === 0 && <span className="text-blue-700">No hay imágenes aún.</span>}
                  {portafolio.map((url, i) => (
                    <img key={i} src={url} alt={`Portafolio ${i+1}`} className="h-16 w-16 object-cover rounded shadow" />
                  ))}
                </div>
              </div>
            </div>
          )}
          {tab === 'productos' && (
            <div>
              <div className="flex gap-4 mb-4">
                <Link href="/productos" className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-full flex items-center gap-2"><FaPlus /> Publicar producto</Link>
                <Link href="/artesano-dashboard/productos" className="bg-blue-100 hover:bg-blue-200 text-blue-900 px-4 py-2 rounded-full flex items-center gap-2"><FaStore /> Gestionar mis productos</Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {productos.length === 0 && <div className="text-blue-700">No tienes productos publicados.</div>}
                {productos.map(p => (
                  <div key={p.id} className="bg-blue-50 rounded-xl shadow p-4 flex flex-col items-center">
                    <img src={p.imagen || '/default-artesania.png'} alt={p.titulo} className="h-20 w-full object-cover rounded mb-2" />
                    <div className="font-bold text-blue-900">{p.titulo}</div>
                    <div className="text-blue-800 text-sm">{p.descripcion}</div>
                    <div className="text-blue-700 font-semibold mt-1">${p.precio}</div>
                    <Link href={`/productos/${p.id}`} className="mt-2 text-blue-700 underline">Ver detalle</Link>
                  </div>
                ))}
              </div>
            </div>
          )}
          {tab === 'resenas' && (
            <div>
              <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2"><FaStar /> Reseñas de clientes</h3>
              {resenas.length === 0 ? (
                <div className="text-blue-700">Aún no tienes reseñas.</div>
              ) : (
                <ul>
                  {resenas.map(r => (
                    <li key={r.id} className="mb-2">
                      <span className="text-yellow-600">{'★'.repeat(r.calificacion)}</span>
                      <span className="ml-2 text-blue-800 italic">"{r.comentario}"</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          {tab === 'config' && (
            <div>
              <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2"><FaCog /> Configuración</h3>
              <Link href="/perfil/editar" className="block mb-2 text-blue-700 underline flex items-center gap-2"><FaEdit /> Editar información</Link>
              <Link href="/recuperar-contrasena" className="block mb-2 text-blue-700 underline flex items-center gap-2"><FaKey /> Cambiar contraseña</Link>
              <button onClick={handleLogout} className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full flex items-center gap-2"><FaSignOutAlt /> Cerrar sesión</button>
            </div>
          )}
        </div>
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <h3 className="text-xl font-bold text-blue-900 mb-4">Mensajes recibidos</h3>
          {mensajes.length === 0 ? (
            <div className="text-blue-700">No tienes mensajes nuevos.</div>
          ) : (
            <ul>
              {mensajes.map(m => (
                <li key={m.id} className="mb-2 border-b pb-2">
                  <b>De:</b> Usuario {m.remitenteId} <br />
                  <span className="text-blue-800">{m.contenido}</span>
                  <div className="text-xs text-gray-500">{m.timestamp && new Date(m.timestamp).toLocaleString()}</div>
                  <Link href={`/mensajes?destinatarioId=${m.remitenteId}`} className="text-blue-700 underline ml-2">Responder</Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
