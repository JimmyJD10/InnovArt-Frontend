export default function CompradorPerfilPage() {
  return <div className="p-8">Perfil del comprador (en construcción)</div>
}

useEffect(() => {
  axios.get('http://3.148.112.19:3001/api/reviews?clienteId=' + user.id)
    .then(res => setResenas(res.data))
    .catch(() => setResenas([]))
}, [user])
