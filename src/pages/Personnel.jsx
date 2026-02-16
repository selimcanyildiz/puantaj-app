import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getData, setData } from "../utils/storage"
import Card from "../components/Card"
import Input from "../components/Input"
import Button from "../components/Button"
import AppLayout from "../layout/AppLayout"

export default function Personnel() {
  const [list, setList] = useState([])
  const [name, setName] = useState("")

  useEffect(() => {
    setList(getData("personnel"))
  }, [])

  const add = () => {
    const updated = [...list, { id: Date.now(), name }]
    setList(updated)
    setData("personnel", updated)
    setName("")
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
            <li key={p.id} className="py-2">
              <Link
                to={`/personel/${p.id}`}
                className="text-blue-600 hover:underline"
              >
                {p.name}
              </Link>
            </li>
          ))}
        </ul>
      </Card>
    </AppLayout>
  )
}
