'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { FaSearch, FaPlus, FaBoxOpen, FaTag, FaDollarSign, FaImage, FaMapMarkerAlt } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function Productos() {
  const [productos, setProductos] = useState<any[]>([]);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [categoria, setCategoria] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [imagen, setImagen] = useState('');
  const [msg, setMsg] = useState('');
  const router = useRouter();

  const fetchProductos = async () => {
    const res = await axios.get('http://3.148.112.19:3001/api/products', {
      params: { categoria, ubicacion }
    });
    setProductos(res.data);
  };

  const handleCrear = async (e?: any) => {
    if (e) e.preventDefault();
    setMsg('');
    try {
      await axios.post('http://3.148.112.19:3001/api/products', {
        titulo: nombre,
        descripcion,
        precio: parseFloat(precio),
        categoria,
        ubicacion,
        imagen
      });
      setNombre('');
      setDescripcion('');
      setPrecio('');
      setCategoria('');
      setUbicacion('');
      setImagen('');
      setMsg('Producto creado correctamente');
      fetchProductos();
    } catch {
      setMsg('Error al crear producto');
    }
  };

  useEffect(() => { fetchProductos(); }, []);

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
            <Link href="/contacto" className="text-white font-semibold hover:text-blue-300 transition-colors">CONTACTO</Link>
          </div>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h2 className="text-3xl font-bold text-blue-900 mb-6 flex items-center gap-3">
          <FaBoxOpen className="text-blue-700" /> Productos disponibles
        </h2>
        {/* Filtros */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex gap-2 items-center">
            <FaTag className="text-blue-400" />
            <select value={categoria} onChange={e => setCategoria(e.target.value)} className="border rounded px-2 py-1">
              <option value="">Todas las categorías</option>
              <option value="Cerámica">Cerámica</option>
              <option value="Textiles">Textiles</option>
              <option value="Madera">Madera</option>
              <option value="Joyería">Joyería</option>
              <option value="Pintura">Pintura</option>
              <option value="Cuero">Cuero</option>
              <option value="Otros">Otros</option>
            </select>
          </div>
          <div className="flex gap-2 items-center">
            <FaMapMarkerAlt className="text-blue-400" />
            <input
              type="text"
              placeholder="Ubicación"
              value={ubicacion}
              onChange={e => setUbicacion(e.target.value)}
              className="border rounded px-2 py-1"
            />
          </div>
          <button onClick={fetchProductos} className="bg-blue-700 text-white px-4 py-1 rounded flex items-center gap-2">
            <FaSearch /> Filtrar
          </button>
        </div>
        {/* Formulario de creación */}
        <div className="bg-white/95 rounded-xl shadow p-6 mb-10 max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2"><FaPlus /> Crear nuevo producto</h3>
          <form className="flex flex-col gap-3" onSubmit={handleCrear}>
            <div className="flex gap-2 items-center">
              <FaBoxOpen className="text-blue-400" />
              <input placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} className="border rounded px-2 py-1 flex-1" required />
            </div>
            <div className="flex gap-2 items-center">
              <FaImage className="text-blue-400" />
              <input placeholder="URL de imagen" value={imagen} onChange={e => setImagen(e.target.value)} className="border rounded px-2 py-1 flex-1" />
            </div>
            <div className="flex gap-2 items-center">
              <FaTag className="text-blue-400" />
              <input placeholder="Categoría" value={categoria} onChange={e => setCategoria(e.target.value)} className="border rounded px-2 py-1 flex-1" />
            </div>
            <div className="flex gap-2 items-center">
              <FaMapMarkerAlt className="text-blue-400" />
              <input placeholder="Ubicación" value={ubicacion} onChange={e => setUbicacion(e.target.value)} className="border rounded px-2 py-1 flex-1" />
            </div>
            <div className="flex gap-2 items-center">
              <FaDollarSign className="text-blue-400" />
              <input placeholder="Precio" type="number" value={precio} onChange={e => setPrecio(e.target.value)} className="border rounded px-2 py-1 flex-1" min={0} required />
            </div>
            <textarea placeholder="Descripción" value={descripcion} onChange={e => setDescripcion(e.target.value)} className="border rounded px-2 py-1" rows={2} required />
            <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded font-semibold flex items-center gap-2 mt-2">
              <FaPlus /> Crear producto
            </button>
            {msg && <div className="text-green-700 mt-2">{msg}</div>}
          </form>
        </div>
        {/* Lista de productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {productos.length === 0 ? (
            <div className="col-span-full text-blue-700 text-center py-8">No hay productos para mostrar.</div>
          ) : (
            productos.map(p => (
              <div key={p.id} className="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center hover:shadow-blue-200 transition-shadow">
                <img src={p.imagen || '/default-artesania.png'} alt={p.titulo} className="h-32 w-full object-cover rounded mb-2" />
                <div className="font-bold text-blue-900 text-lg">{p.titulo}</div>
                <div className="text-blue-800 text-sm mb-1">{p.descripcion}</div>
                <div className="flex items-center gap-2 text-blue-700 mb-1">
                  <FaTag /> <span>{p.categoria || 'Sin categoría'}</span>
                </div>
                <div className="flex items-center gap-2 text-blue-700 mb-1">
                  <FaMapMarkerAlt /> <span>{p.ubicacion || 'Sin ubicación'}</span>
                </div>
                <div className="text-blue-900 font-bold text-lg mb-2">${p.precio}</div>
                <Link href={`/productos/${p.id}`} className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-1 rounded font-semibold transition">Ver más</Link>
              </div>
            ))
          )}
        </div>
      </div>
      <footer className="w-full bg-blue-900 text-white text-sm py-3 px-6 flex justify-between items-center z-10 relative mt-12">
        <span>&copy; 2025 InnovArt. Todos los derechos reservados.</span>
        <span className="underline hover:text-gray-300 cursor-pointer">Política de privacidad</span>
      </footer>
    </div>
  );
}