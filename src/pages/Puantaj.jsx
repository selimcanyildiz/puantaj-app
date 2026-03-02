import { useState, useEffect } from "react"
import AppLayout from "../layout/AppLayout"
import Card from "../components/Card"
import { getPersonnel, getSites, getPuantaj, setPuantajCell, clearPuantajCell } from "../utils/api"
import toast from "react-hot-toast"
import * as XLSX from "xlsx"

export default function Puantaj() {
  const [personnel, setPersonnel] = useState([])
  const [sites, setSites] = useState([])
  const [records, setRecords] = useState([])
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  })

  const [year, m] = month.split("-")
  const daysInMonth = new Date(year, m, 0).getDate()

  useEffect(() => {
    getPersonnel().then(setPersonnel).catch(() => toast.error("Personel alınamadı"))
    getSites().then(setSites).catch(() => toast.error("Şantiye alınamadı"))
  }, [])

  useEffect(() => {
    getPuantaj(month).then(setRecords).catch(() => toast.error("Puantaj alınamadı"))
  }, [month])

  const getCell = (personId, day) => {
    const date = `${month}-${String(day).padStart(2, "0")}`
    const record = records.find(r => r.person_id === personId && r.date === date)
    return record ? record.site_id : ""
  }

  const setCell = async (personId, day, siteId) => {
    const date = `${month}-${String(day).padStart(2, "0")}`

    try {
      if (siteId === null) {
        await clearPuantajCell(personId, date)
        setRecords(prev => prev.filter(r => !(r.person_id === personId && r.date === date)))
      } else {
        const updated = await setPuantajCell(personId, date, siteId)
        setRecords(prev => {
          const filtered = prev.filter(r => !(r.person_id === personId && r.date === date))
          return [...filtered, updated]
        })
      }
    } catch (err) {
      toast.error(err.message)
    }
  }

  const total = (personId) =>
    records.filter(r => {
      const site = sites.find(s => s.id === r.site_id)
      return r.person_id === personId &&
        r.date.startsWith(month) &&
        site?.code !== "LEAVE"
    }).length

  const exportToExcel = () => {
    const header = [
      "Personel",
      ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
      "Toplam"
    ]

    const rows = personnel.map(p => {
      const row = [p.name]
      for (let day = 1; day <= daysInMonth; day++) {
        const siteId = getCell(p.id, day)
        const site = sites.find(s => s.id === siteId)
        row.push(site ? site.name : "")
      }
      row.push(total(p.id))
      return row
    })

    const worksheet = XLSX.utils.aoa_to_sheet([header, ...rows])
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Puantaj")
    XLSX.writeFile(workbook, `puantaj-${month}.xlsx`)
  }

  return (
    <AppLayout>
      <Card title="Aylık Puantaj">
        <div className="flex items-center gap-4 mb-4">
          <input
            type="month"
            value={month}
            onChange={e => setMonth(e.target.value)}
            className="border px-3 py-2 rounded"
          />
          <button
            onClick={exportToExcel}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Excel'e Aktar
          </button>
          <span className="text-sm text-gray-500">Gün bazlı şantiye seçimi</span>
        </div>

        <div className="overflow-x-auto bg-gray-100 p-2 rounded">
          <table className="border-collapse text-sm min-w-max bg-white">
            <thead>
              <tr>
                <th className="border p-2 bg-gray-100 sticky left-0 z-10 min-w-[180px]">
                  Personel
                </th>
                {Array.from({ length: daysInMonth }, (_, i) => (
                  <th key={i} className="border p-2 bg-gray-100 text-center min-w-[80px]">
                    {i + 1}
                  </th>
                ))}
                <th className="border p-2 bg-gray-100 min-w-[80px]">Toplam</th>
              </tr>
            </thead>
            <tbody>
              {personnel.map(p => (
                <tr key={p.id}>
                  <td className="border p-2 font-medium bg-white sticky left-0 z-10 min-w-[180px]">
                    {p.name}
                  </td>
                  {Array.from({ length: daysInMonth }, (_, i) => {
                    const day = i + 1
                    const value = getCell(p.id, day)
                    const isLeave = sites.find(s => s.id === value)?.code === "LEAVE"

                    return (
                      <td key={day} className={`border p-1 min-w-[80px] ${isLeave ? "bg-red-100" : ""}`}>
                        <select
                          value={value}
                          onChange={e =>
                            setCell(p.id, day, e.target.value === "" ? null : Number(e.target.value))
                          }
                          className={`w-full border rounded text-xs px-1 py-1 ${isLeave ? "bg-red-100" : ""}`}
                        >
                          <option value="">-</option>
                          {sites.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                          ))}
                        </select>
                      </td>
                    )
                  })}
                  <td className="border text-center font-bold bg-gray-50">
                    {total(p.id)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </AppLayout>
  )
}