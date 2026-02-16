import { useParams, Link } from "react-router-dom"
import { useState } from "react"
import AppLayout from "../layout/AppLayout"
import Card from "../components/Card"
import { getData } from "../utils/storage"

export default function PersonnelDetail() {
  const { id } = useParams()
  const personId = Number(id)

  const personnel = getData("personnel") || []
  const sites = getData("sites") || []
  const records = getData("puantaj") || []

  const person = personnel.find(p => p.id === personId)
  const [month, setMonth] = useState("2026-02")

  if (!person) return <AppLayout>Personel yok</AppLayout>

  // Aylık kayıtlar
  const monthRecords = records.filter(
    r => r.personId === personId && r.date.startsWith(month)
  )

  // Çalışılan gün (izin hariç)
  const workedDays = monthRecords.filter(r => r.siteId !== 0).length

  // İzin günleri
  const leaveDays = monthRecords.filter(r => r.siteId === 0).length

  // Şantiye bazlı dağılım (izin hariç)
  const summary = {}
  monthRecords.forEach(r => {
    if (r.siteId === 0) return
    summary[r.siteId] = (summary[r.siteId] || 0) + 1
  })

  return (
    <AppLayout>
      <Card title={person.name}>
        <Link to="/" className="text-blue-600 underline text-sm">
          ← Geri
        </Link>

        <div className="mt-4">
          <input
            type="month"
            value={month}
            onChange={e => setMonth(e.target.value)}
            className="border px-3 py-2 rounded"
          />
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-gray-100 p-4 rounded">
            <div className="text-gray-500 text-sm">Çalışılan Gün</div>
            <div className="text-3xl font-bold">{workedDays}</div>
          </div>

          <div className="bg-red-100 p-4 rounded">
            <div className="text-gray-500 text-sm">İzin Günü</div>
            <div className="text-3xl font-bold text-red-600">
              {leaveDays}
            </div>
          </div>

          <div className="bg-gray-100 p-4 rounded">
            <div className="text-gray-500 text-sm">Toplam Kayıt</div>
            <div className="text-3xl font-bold">
              {monthRecords.length}
            </div>
          </div>
        </div>

        <div className="mt-6 bg-gray-100 p-4 rounded">
          <div className="text-gray-500 text-sm mb-2">
            Şantiye Dağılımı
          </div>

          {Object.keys(summary).length === 0 ? (
            <p className="text-sm text-gray-500">
              Bu ay çalışma yok
            </p>
          ) : (
            <ul className="space-y-1">
              {Object.entries(summary).map(([siteId, count]) => {
                const site = sites.find(s => s.id === Number(siteId))
                return (
                  <li
                    key={siteId}
                    className="flex justify-between text-sm"
                  >
                    <span>{site?.name}</span>
                    <span className="font-medium">{count} gün</span>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </Card>
    </AppLayout>
  )
}
