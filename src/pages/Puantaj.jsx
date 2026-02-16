import { useState } from "react"
import AppLayout from "../layout/AppLayout"
import Card from "../components/Card"
import { getData, setData } from "../utils/storage"
import * as XLSX from "xlsx"

export default function Puantaj() {
  const personnel = getData("personnel") || []
  const sites = getData("sites") || []
  const [records, setRecords] = useState(getData("puantaj") || [])
  const [month, setMonth] = useState("2026-02")

  const [year, m] = month.split("-")
  const daysInMonth = new Date(year, m, 0).getDate()

  const getCell = (personId, day) => {
    const date = `${month}-${String(day).padStart(2, "0")}`
    const record = records.find(
      r => r.personId === personId && r.date === date
    )
    return record ? record.siteId : ""
  }

  const setCell = (personId, day, siteId) => {
    const date = `${month}-${String(day).padStart(2, "0")}`

    let updated = records.filter(
      r => !(r.personId === personId && r.date === date)
    )

    // ⬇️ 0 (İZİN) DA KAYDEDİLMELİ
    if (siteId !== null) {
      updated.push({ personId, date, siteId })
    }

    setRecords(updated)
    setData("puantaj", updated)
  }

  const total = (personId) =>
    records.filter(
      r =>
        r.personId === personId &&
        r.date.startsWith(month) &&
        r.siteId !== 0 // İZİN HARİÇ
    ).length

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

  XLSX.writeFile(
    workbook,
    `puantaj-${month}.xlsx`
  )
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
    Excel’e Aktar
  </button>

  <span className="text-sm text-gray-500">
    Gün bazlı şantiye seçimi
  </span>
</div>


        <div className="overflow-x-auto bg-gray-100 p-2 rounded">
          <table className="border-collapse text-sm min-w-max bg-white">
            <thead>
              <tr>
                <th className="border p-2 bg-gray-100 sticky left-0 z-10 min-w-[180px]">
                  Personel
                </th>

                {Array.from({ length: daysInMonth }, (_, i) => (
                  <th
                    key={i}
                    className="border p-2 bg-gray-100 text-center min-w-[80px]"
                  >
                    {i + 1}
                  </th>
                ))}

                <th className="border p-2 bg-gray-100 min-w-[80px]">
                  Toplam
                </th>
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

                    return (
                      <td
                        key={day}
                        className={`border p-1 min-w-[80px]
                          ${value === 0 ? "bg-red-100" : ""}
                        `}
                      >
                        <select
                          value={value}
                          onChange={e =>
                            setCell(
                              p.id,
                              day,
                              e.target.value === ""
                                ? null
                                : Number(e.target.value)
                            )
                          }
                          className={`w-full border rounded text-xs px-1 py-1
                            ${value === 0 ? "bg-red-100" : ""}
                          `}
                        >
                          <option value="">-</option>
                          {sites.map(s => (
                            <option key={s.id} value={s.id}>
                              {s.name}
                            </option>
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
