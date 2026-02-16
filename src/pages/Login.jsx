import { useState } from "react"
import Button from "../components/Button"
import Input from "../components/Input"

const users = [
  { username: "admin", password: "1234" },
  { username: "user", password: "1234" },
]

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const login = () => {
    const ok = users.find(
      u => u.username === username && u.password === password
    )
    if (!ok) return alert("Hatalı giriş")

    localStorage.setItem("user", JSON.stringify(ok))
    onLogin()
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow w-96">
        <h1 className="text-xl font-bold mb-6 text-center">Giriş</h1>

        <div className="space-y-3">
          <Input placeholder="Kullanıcı" onChange={e => setUsername(e.target.value)} />
          <Input type="password" placeholder="Şifre" onChange={e => setPassword(e.target.value)} />
          <Button className="w-full" onClick={login}>
            Giriş Yap
          </Button>
        </div>
      </div>
    </div>
  )
}
