import { Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Personnel from "./pages/Personnel"
import Sites from "./pages/Sites"
import Puantaj from "./pages/Puantaj"
import PersonnelDetail from "./pages/PersonnelDetail"
import { initDefaultData } from "./utils/storage"
import { Toaster } from "react-hot-toast"

function App() {
  const logged = !!localStorage.getItem("user")

  initDefaultData()

  return (
    <>
      {/* 🔥 TOASTER HER ZAMAN BURADA */}
      <Toaster position="top-center" />

      {!logged ? (
        <Login onLogin={() => location.reload()} />
      ) : (
        <Routes>
          <Route path="/" element={<Personnel />} />
          <Route path="/sites" element={<Sites />} />
          <Route path="/puantaj" element={<Puantaj />} />
          <Route path="/personel/:id" element={<PersonnelDetail />} />
        </Routes>
      )}
    </>
  )
}

export default App
