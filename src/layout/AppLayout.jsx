import Sidebar from "./Sidebar"
import Header from "./Header"

export default function AppLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* SIDEBAR SABİT */}
      <Sidebar />

      {/* SAĞ TARAF */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER SABİT */}
        <Header />

        {/* SADECE DİKEY SCROLL */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  )
}
