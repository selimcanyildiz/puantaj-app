import { useEffect, useState } from "react"
import AppLayout from "../layout/AppLayout"
import Card from "../components/Card"
import Input from "../components/Input"
import Button from "../components/Button"
import { getSites, addSite, deleteSite } from "../utils/api"
import toast from "react-hot-toast"

export default function Sites() {
  const [list, setList] = useState([])
  const [name, setName] = useState("")

  useEffect(() => {
    getSites()
      .then(setList)
      .catch(() => toast.error("Şantiye listesi alınamadı"))
  }, [])

  const add = async () => {
    if (!name.trim()) return
    try {
      const site = await addSite(name.trim())
      setList(prev => [...prev, site])
      setName("")
      toast.success("Şantiye eklendi")
    } catch (err) {
      toast.error(err.message)
    }
  }

  const remove = async (id, siteName) => {
    try {
      await deleteSite(id)
      setList(prev => prev.filter(s => s.id !== id))
      toast.success(`${siteName} silindi`)
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <AppLayout>
      <Card title="Şantiyeler">
        <div className="flex gap-3 mb-4">
          <Input
            placeholder="Şantiye adı"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <Button onClick={add}>Ekle</Button>
        </div>
        <ul className="divide-y">
          {list.map(s => (
            <li key={s.id} className="py-2 flex justify-between items-center">
              <span>{s.name}</span>
              {s.code !== "LEAVE" && (
                <button
                  onClick={() => remove(s.id, s.name)}
                  className="text-xs text-red-400 hover:text-red-600"
                >
                  Sil
                </button>
              )}
            </li>
          ))}
        </ul>
      </Card>
    </AppLayout>
  )
}