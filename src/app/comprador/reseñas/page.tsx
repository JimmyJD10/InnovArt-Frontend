export default function CompradorResenasPage() {
  return <div className="p-8">Reseñas del comprador (en construcción)</div>
}

useEffect(() => {
  axios.get('http://3.148.112.19:3001/api/reviews?clienteId=' + user.id)
    .then(res => setResenas(res.data))
    .catch(() => setResenas([]))
}, [user])
