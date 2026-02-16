import { Link, useLocation } from "react-router-dom"

const menu = [
  { path: "/", label: "Personel" },
  { path: "/sites", label: "Şantiyeler" },
  { path: "/puantaj", label: "Puantaj" },
]

export default function Sidebar() {
  const { pathname } = useLocation()

  return (
    <aside className="w-64 bg-white shadow-lg p-5 flex-shrink-0">
      <h1 className="text-xl font-bold mb-6">İf Mekanik</h1>

      <nav className="space-y-2">
        {menu.map(m => (
          <Link
            key={m.path}
            to={m.path}
            className={`block px-3 py-2 rounded-lg ${
              pathname === m.path
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {m.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
