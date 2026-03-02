import { useParams, Link } from "react-router-dom"
import { useState, useEffect } from "react"
import AppLayout from "../layout/AppLayout"
import Card from "../components/Card"
import { getPersonnel, getSites, getMonthlySummary } from "../utils/api"
import toast from "react-hot-toast"

export default function PersonnelDetail() {
  const { id } = useParams()
  const personId = Number(id)

  const [person, setPerson] = useState(null)
  const [sites, setSites] = useState([])
  const [summary, setSummary] = useState(null)
  const [month, setMonth] = useState("2026-02")

  useEffect(() => {
    getPersonnel()
      .then(list => setPerson(list.find(p => p.id === personId)))
      .catch(() => toast.error("Personel alınamadı"))

    getSites()
      .then(setSites)
      .catch(() => toast.error("Şantiye alınamadı"))
  }, [])

  useEffect(() => {
    getMonthlySummary(month)
      .then(data => setSummary(data.find(s => s.person_id === personId)))
      .catch(() => toast.error("Özet alınamadı"))
  }, [month])

  if (!person) return <AppLayout><p className="p-4">Yükleniyor...</p></AppLayout>

  const workedDays = summary?.worked_days ?? 0
  const leaveDays  = summary?.leave_days  ?? 0
  const totalDays  = workedDays + leaveDays

  // Şantiye dağılımı
  const siteMap = {}
  summary?.records?.forEach(r => {
    const site = sites.find(s => s.id === r.site_id)
    if (site?.code === "LEAVE") return
    siteMap[r.site_id] = (siteMap[r.site_id] || 0) + 1
  })

  return (
    <AppLayout>
      <Card title={person.name}>
        <Link to="/" className="text-blue-600 underline text-sm">← Geri</Link>

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
            <div className="text-3xl font-bold text-red-600">{leaveDays}</div>
          </div>
          <div className="bg-gray-100 p-4 rounded">
            <div className="text-gray-500 text-sm">Toplam Kayıt</div>
            <div className="text-3xl font-bold">{totalDays}</div>
          </div>
        </div>

        <div className="mt-6 bg-gray-100 p-4 rounded">
          <div className="text-gray-500 text-sm mb-2">Şantiye Dağılımı</div>
          {Object.keys(siteMap).length === 0 ? (
            <p className="text-sm text-gray-500">Bu ay çalışma yok</p>
          ) : (
            <ul className="space-y-1">
              {Object.entries(siteMap).map(([siteId, count]) => {
                const site = sites.find(s => s.id === Number(siteId))
                return (
                  <li key={siteId} className="flex justify-between text-sm">
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