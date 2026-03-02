import { useState } from "react"
import Button from "../components/Button"
import Input from "../components/Input"
import toast from "react-hot-toast"
import { login } from "../utils/api"

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async () => {
    if (!username || !password) {
      toast.error("Kullanıcı adı ve şifre zorunlu")
      return
    }

    try {
      await login(username, password)
      localStorage.setItem("user", JSON.stringify({ username }))
      toast.success("Giriş başarılı")
      onLogin()
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow w-96">
        <h1 className="text-xl font-bold mb-6 text-center">Giriş</h1>
        <div className="space-y-3">
          <Input
            placeholder="Kullanıcı"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <Button className="w-full" onClick={handleLogin}>
            Giriş Yap
          </Button>
        </div>
      </div>
    </div>
  )
}