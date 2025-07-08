'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { API_URL } from '../../services/api'

export default function PerfilPage() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.replace('/login')
      return
    }
    axios.get(`${API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      const user = res.data
      // Guarda el usuario correcto en localStorage para evitar "Demo"
      localStorage.setItem('user', JSON.stringify(user))
      // Redirige según el rol
      if (user.rol === 'admin') router.replace('/perfil/admin')
      else if (user.rol === 'artesano') router.replace('/perfil/artesano')
      else router.replace('/perfil/cliente')
    }).catch(() => {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      router.replace('/login')
    })
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      Cargando perfil...
    </div>
  )
}