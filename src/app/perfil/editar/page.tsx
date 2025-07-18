'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

export default function EditarPerfil() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      // No redirigir aquí, dejar que el usuario vea el login
      return
    }
    axios.get('http://3.148.112.19:3001/api/users/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setUser(res.data)
        setLoading(false)
      })
      .catch(err => {
        setLoading(false)
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
      })
  }, [])

  const handleChange = (e: any) => {
    setUser({ ...user, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e: any) => {
    setUser({ ...user, foto_perfil: e.target.files[0] });
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    Object.entries(user).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (value instanceof Blob) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      }
    });
    await axios.put(`http://3.148.112.19:3001/api/users/${user.id}`, formData, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
    });
    setMsg('Perfil actualizado correctamente')
    localStorage.setItem('user', JSON.stringify(user))
  }

  if (loading) return <div className="p-8">Cargando...</div>
  if (!user) return null

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold text-blue-900 mb-4">Editar Perfil</h2>
      <div className="flex flex-col gap-3">
        <input name="nombre_completo" value={user.nombre_completo || ''} onChange={handleChange} placeholder="Nombre completo" className="border px-2 py-1" />
        <input name="correo" value={user.correo || ''} onChange={handleChange} placeholder="Correo" className="border px-2 py-1" />
        <input name="telefono" value={user.telefono || ''} onChange={handleChange} placeholder="Teléfono" className="border px-2 py-1" />
        <input name="ciudad" value={user.ciudad || ''} onChange={handleChange} placeholder="Ciudad" className="border px-2 py-1" />
        <input name="pais" value={user.pais || ''} onChange={handleChange} placeholder="País" className="border px-2 py-1" />
        <div className="text-blue-800 font-semibold">
          Rol: {user.rol}
        </div>
        {user.rol === 'artesano' && (
          <>
            <textarea name="descripcion" value={user.descripcion || ''} onChange={handleChange} placeholder="Descripción" className="border px-2 py-1" />
            <input name="especialidades" value={user.especialidades || ''} onChange={handleChange} placeholder="Especialidades (separadas por coma)" className="border px-2 py-1" />
          </>
        )}
        <input type="file" name="foto_perfil" accept="image/*" onChange={handleFileChange} />
        <button onClick={handleSave} className="bg-blue-700 text-white px-4 py-2 rounded">Guardar cambios</button>
        {msg && <div className="text-green-700 mt-2">{msg}</div>}
      </div>
    </div>
  )
}
