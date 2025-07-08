"use client"
import axios from "axios"
import { useEffect, useState } from "react"

export default function CompradorResenasPage() {
  const [resenas, setResenas] = useState<any[]>([]);
  const [user, setUser] = useState<{ id: string }>({ id: "" }); // Replace with actual user fetching logic

  useEffect(() => {
    if (user.id) {
      axios.get('http://3.148.112.19:3001/api/reviews?clienteId=' + user.id)
        .then(res => setResenas(res.data))
        .catch(() => setResenas([]))
    }
  }, [user]);

  return <div className="p-8">Reseñas del comprador (en construcción)</div>
}

