'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function CarritoPage() {
  const [carrito, setCarrito] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setCarrito([])
      setLoading(false)
      return
    }
    axios.get('http://3.148.112.19:3001/api/pedidos/carrito', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setCarrito(res.data)
        setLoading(false)
      })
      .catch(() => {
        setCarrito([])
        setLoading(false)
      })
  }, [])

  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0)

  const eliminar = async (id: number) => {
    const token = localStorage.getItem('token')
    await axios.delete(`http://3.148.112.19:3001/api/pedidos/carrito/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    setCarrito(carrito.filter(i => i.id !== id))
  }

  if (loading) return <div className="p-8">Cargando...</div>

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-blue-900 mb-4">Carrito de Compras</h2>
      {carrito.length === 0 ? (
        <div className="text-blue-700">Tu carrito está vacío.</div>
      ) : (
        <>
          <div className="grid gap-4">
            {carrito.map((item) => (
              <div key={item.id} className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center transition-transform transform hover:scale-105">
                <div>
                  <div className="font-semibold text-blue-900">{item.nombre}</div>
                  <div className="text-gray-700">Cantidad: {item.cantidad}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-900">${item.precio * item.cantidad}</div>
                  <button onClick={() => eliminar(item.id)} className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors">
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-lg font-bold text-blue-900">Total: ${total}</div>
          <button className="mt-6 bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800 transition-colors">
            Proceder al pago
          </button>
        </>
      )}
      <div className="mt-8 text-blue-700">
        <b>¿Cómo funciona?</b> Agrega productos desde la galería o perfil de artesanos y vuelve aquí para finalizar tu compra.
      </div>
    </div>
  )
}
