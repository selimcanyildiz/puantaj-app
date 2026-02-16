import { Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Personnel from "./pages/Personnel"
import Sites from "./pages/Sites"
import Puantaj from "./pages/Puantaj"
import PersonnelDetail from "./pages/PersonnelDetail"
import { initDefaultData } from "./utils/storage"


function App() {
  const logged = !!localStorage.getItem("user")

  initDefaultData()

  if (!logged) {
    return <Login onLogin={() => location.reload()} />
  }

  return (
    <Routes>
      <Route path="/" element={<Personnel />} />
      <Route path="/sites" element={<Sites />} />
      <Route path="/puantaj" element={<Puantaj />} />
      <Route path="/personel/:id" element={<PersonnelDetail />} />
    </Routes>
  )
}

export default App
