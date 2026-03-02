import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Card from "../components/Card"
import Input from "../components/Input"
import Button from "../components/Button"
import AppLayout from "../layout/AppLayout"
import { getPersonnel, addPersonnel, deletePersonnel } from "../utils/api"
import toast from "react-hot-toast"

export default function Personnel() {
  const [list, setList] = useState([])
  const [name, setName] = useState("")

  useEffect(() => {
    getPersonnel()
      .then(setList)
      .catch(() => toast.error("Personel listesi alınamadı"))
  }, [])

  const add = async () => {
    if (!name.trim()) return
    try {
      const person = await addPersonnel(name.trim())
      setList(prev => [...prev, person])
      setName("")
      toast.success("Personel eklendi")
    } catch (err) {
      toast.error(err.message)
    }
  }

  const remove = async (id, personName) => {
    try {
      await deletePersonnel(id)
      setList(prev => prev.filter(p => p.id !== id))
      toast.success(`${personName} silindi`)
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <AppLayout>
      <Card title="Personel">
        <div className="flex gap-3 mb-4">
          <Input
            placeholder="Ad Soyad"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <Button onClick={add}>Ekle</Button>
        </div>
        <ul className="divide-y">
          {list.map(p => (
            <li key={p.id} className="py-2 flex justify-between items-center">
              <Link to={`/personel/${p.id}`} className="text-blue-600 hover:underline">
                {p.name}
              </Link>
              <button
                onClick={() => remove(p.id, p.name)}
                className="text-xs text-red-400 hover:text-red-600"
              >
                Sil
              </button>
            </li>
          ))}
        </ul>
      </Card>
    </AppLayout>
  )
}