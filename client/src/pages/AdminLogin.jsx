import { useState } from "react"
import { useNavigate } from "react-router-dom"

const API_URL = "http://localhost:5000"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [err, setErr] = useState("")
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  // Dynamic greeting based on time
  const hour = new Date().getHours()

  let greeting = "Habari"

  if (hour < 12) {
    greeting = "Habari ya asubuhi"
  } else if (hour < 18) {
    greeting = "Habari ya mchana"
  } else {
    greeting = "Habari ya jioni"
  }

  async function onSubmit(e) {
    e.preventDefault()
    setErr("")
    setLoading(true)

    try {
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || "Login failed")

      localStorage.setItem("admin_token", data.token)
      nav("/admin/orders")
    } catch (e) {
      setErr(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-md bg-white rounded-2xl p-6 shadow">

        <h1 className="text-2xl font-semibold mb-4 leading-tight">
          {greeting} 👋🏿
          <br />
          Let's get those orders ready.
        </h1>

        {err && <p className="mb-3 text-sm text-red-600">{err}</p>}

        <label className="block text-sm mb-1">Email</label>
        <input
          className="w-full border rounded-lg p-2 mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          autoComplete="email"
        />

        <label className="block text-sm mb-1">Password</label>
        <input
          className="w-full border rounded-lg p-2 mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          autoComplete="current-password"
        />

        <button
          disabled={loading}
          className="w-full rounded-lg p-2 bg-black text-white disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

      </form>
    </div>
  )
}