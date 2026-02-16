import { useEffect, useState } from "react"
import AppLayout from "../layout/AppLayout"
import Card from "../components/Card"
import Input from "../components/Input"
import Button from "../components/Button"
import { getData, setData } from "../utils/storage"

export default function Sites() {
  const [list, setList] = useState([])
  const [name, setName] = useState("")

  useEffect(() => {
    setList(getData("sites"))
  }, [])

  const add = () => {
    if (!name) return
    const updated = [...list, { id: Date.now(), name }]
    setList(updated)
    setData("sites", updated)
    setName("")
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
            <li key={s.id} className="py-2">
              {s.name}
            </li>
          ))}
        </ul>
      </Card>
    </AppLayout>
  )
}
