import { useEffect, useMemo, useState } from "react"
import Container from "../components/layout/Container"
import { formatAUD } from "../utils/money"

const API_URL = "http://localhost:5000"

function startOfToday() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}
function startOfWeekMonday() {
  const d = startOfToday()
  const day = d.getDay() // 0 Sun ... 6 Sat
  const diff = (day + 6) % 7 // Monday=0
  d.setDate(d.getDate() - diff)
  return d
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [status, setStatus] = useState("pending") // ✅ default pending
  const [pickedUp, setPickedUp] = useState("false")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [view, setView] = useState("pickup") // "pickup" | "table"
  const [query, setQuery] = useState("")
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [range, setRange] = useState("today") // ✅ "today" | "week" | "all"

  function logout() {
    localStorage.removeItem("admin_token")
    window.location.href = "/admin/login"
  }

  async function loadOrders({ silent = false } = {}) {
    if (!silent) {
      setLoading(true)
      setError("")
    }

    try {
      const token = localStorage.getItem("admin_token")
      if (!token) return logout()

      const qs = new URLSearchParams()
      if (status) qs.set("status", status)
      if (pickedUp) qs.set("pickedUp", pickedUp)

      const res = await fetch(`${API_URL}/api/orders?${qs.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) return logout()
        throw new Error(data?.error || data?.message || "Failed to load orders")
      }

      setOrders(data.orders || [])
      if (!silent) setError("")
    } catch (err) {
      if (!silent) {
        setError(err.message)
        setOrders([])
      }
    } finally {
      if (!silent) setLoading(false)
    }
  }

  async function togglePickedUp(orderId, next) {
    try {
      const token = localStorage.getItem("admin_token")
      if (!token) return logout()

      const res = await fetch(`${API_URL}/api/orders/${orderId}/picked-up`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ pickedUp: next }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) return logout()
        throw new Error(data?.error || data?.message || "Failed to update order")
      }

      setOrders((prev) => prev.map((o) => (o._id === orderId ? data.order : o)))
    } catch (err) {
      alert(err.message)
    }
  }

  useEffect(() => {
    loadOrders()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, pickedUp])

  useEffect(() => {
    if (!autoRefresh) return
    const t = setInterval(() => loadOrders({ silent: true }), 10000)
    return () => clearInterval(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRefresh, status, pickedUp])

  const filtered = useMemo(() => {
    // 1) date-range filter (client-side, based on createdAt)
    const now = new Date()
    const from =
      range === "today" ? startOfToday() : range === "week" ? startOfWeekMonday() : null

    let list = orders
    if (from) {
      list = list.filter((o) => {
        const created = o.createdAt ? new Date(o.createdAt) : null
        return created && created >= from && created <= now
      })
    }

    // 2) search filter
    const q = query.trim().toLowerCase()
    if (!q) return list

    return list.filter((o) => {
      const name = (o.customer?.name || "").toLowerCase()
      const phone = (o.customer?.phone || "").toLowerCase()
      return name.includes(q) || phone.includes(q)
    })
  }, [orders, query, range])

  const totals = useMemo(() => {
    const count = filtered.length
    const packs = filtered.reduce(
      (sum, o) => sum + (o.items || []).reduce((s, it) => s + (it.quantity || 0), 0),
      0
    )
    const samosas = filtered.reduce(
      (sum, o) =>
        sum + (o.items || []).reduce((s, it) => s + (it.quantity || 0) * (it.packSize || 6), 0),
      0
    )
    const revenueCents = filtered.reduce((sum, o) => sum + (o.totalCents || 0), 0)
    const pickedUpCount = filtered.filter((o) => !!o.pickedUp).length
    const notPickedUp = filtered.filter((o) => !o.pickedUp && o.status !== "cancelled").length

    return { count, packs, samosas, revenueCents, pickedUpCount, notPickedUp }
  }, [filtered])

  function tint(o) {
    if (o.status === "cancelled") return { background: "rgba(220,38,38,0.06)" } // red
    if (o.pickedUp) return { background: "rgba(34,197,94,0.08)" } // green
    return { background: "rgba(245,158,11,0.08)" } // amber
  }

  function RangeButton({ id, label }) {
    const active = range === id
    return (
      <button
        type="button"
        onClick={() => setRange(id)}
        className="rounded-2xl px-4 py-2 font-semibold"
        style={{
          border: "1px solid var(--border)",
          background: active ? "rgba(11,11,12,0.06)" : "white",
          color: "var(--ink)",
        }}
      >
        {label}
      </button>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b" style={{ borderColor: "var(--border)" }}>
        <Container>
          <div className="py-6 flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-extrabold" style={{ color: "var(--ink)" }}>
                Admin • Orders
              </h1>
              <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
                Saturday pickup dashboard — totals + pickup list + time toggle.
              </p>
            </div>

            <div className="ml-auto flex gap-2">
              <button
                type="button"
                onClick={() => loadOrders()}
                className="rounded-2xl px-5 py-2 font-semibold"
                style={{ background: "var(--ink)", color: "white" }}
              >
                Refresh
              </button>
              <button
                type="button"
                onClick={logout}
                className="rounded-2xl px-5 py-2 font-semibold"
                style={{ border: "1px solid var(--border)", background: "white", color: "var(--ink)" }}
              >
                Logout
              </button>
            </div>
          </div>
        </Container>
      </header>

      <main>
        <Container>
          <div className="py-8 grid gap-6">
            {/* Summary */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <div className="rounded-3xl p-4" style={{ border: "1px solid var(--border)" }}>
                <div className="text-xs" style={{ color: "var(--ink-soft)" }}>
                  Orders
                </div>
                <div className="text-2xl font-extrabold" style={{ color: "var(--ink)" }}>
                  {totals.count}
                </div>
              </div>

              <div className="rounded-3xl p-4" style={{ border: "1px solid var(--border)" }}>
                <div className="text-xs" style={{ color: "var(--ink-soft)" }}>
                  Packs sold
                </div>
                <div className="text-2xl font-extrabold" style={{ color: "var(--ink)" }}>
                  {totals.packs}
                </div>
              </div>

              <div className="rounded-3xl p-4" style={{ border: "1px solid var(--border)" }}>
                <div className="text-xs" style={{ color: "var(--ink-soft)" }}>
                  Samosas sold
                </div>
                <div className="text-2xl font-extrabold" style={{ color: "var(--ink)" }}>
                  {totals.samosas}
                </div>
              </div>

              <div className="rounded-3xl p-4" style={{ border: "1px solid var(--border)" }}>
                <div className="text-xs" style={{ color: "var(--ink-soft)" }}>
                  Picked up
                </div>
                <div className="text-2xl font-extrabold" style={{ color: "var(--ink)" }}>
                  {totals.pickedUpCount}
                </div>
              </div>

              <div className="rounded-3xl p-4" style={{ border: "1px solid var(--border)" }}>
                <div className="text-xs" style={{ color: "var(--ink-soft)" }}>
                  Revenue
                </div>
                <div className="text-2xl font-extrabold" style={{ color: "var(--ink)" }}>
                  {formatAUD(totals.revenueCents)}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div
              className="rounded-3xl p-5"
              style={{ border: "1px solid var(--border)", background: "rgba(11,11,12,0.02)" }}
            >
              <div className="flex flex-wrap gap-3 items-end">
                <div>
                  <label className="block text-xs font-semibold" style={{ color: "var(--ink-soft)" }}>
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="mt-1 rounded-2xl px-4 py-2"
                    style={{ border: "1px solid var(--border)" }}
                  >
                    <option value="">All</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold" style={{ color: "var(--ink-soft)" }}>
                    Picked up
                  </label>
                  <select
                    value={pickedUp}
                    onChange={(e) => setPickedUp(e.target.value)}
                    className="mt-1 rounded-2xl px-4 py-2"
                    style={{ border: "1px solid var(--border)" }}
                  >
                    <option value="">All</option>
                    <option value="false">Not picked up</option>
                    <option value="true">Picked up</option>
                  </select>
                </div>

                <div className="min-w-[240px]">
                  <label className="block text-xs font-semibold" style={{ color: "var(--ink-soft)" }}>
                    Search (name or phone)
                  </label>
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="mt-1 w-full rounded-2xl px-4 py-2"
                    placeholder="e.g. Mercy / 04..."
                    style={{ border: "1px solid var(--border)" }}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    id="autorefresh"
                    type="checkbox"
                    checked={autoRefresh}
                    onChange={(e) => setAutoRefresh(e.target.checked)}
                  />
                  <label htmlFor="autorefresh" className="text-sm" style={{ color: "var(--ink)" }}>
                    Auto-refresh (10s)
                  </label>
                </div>

                <div className="ml-auto flex flex-wrap gap-2">
                  {/* ✅ Date range toggle */}
                  <RangeButton id="today" label="Today" />
                  <RangeButton id="week" label="This week" />
                  <RangeButton id="all" label="All time" />

                  {/* View toggle */}
                  <button
                    type="button"
                    onClick={() => setView("pickup")}
                    className="rounded-2xl px-4 py-2 font-semibold"
                    style={{
                      border: "1px solid var(--border)",
                      background: view === "pickup" ? "rgba(11,11,12,0.06)" : "white",
                      color: "var(--ink)",
                    }}
                  >
                    Pickup list
                  </button>
                  <button
                    type="button"
                    onClick={() => setView("table")}
                    className="rounded-2xl px-4 py-2 font-semibold"
                    style={{
                      border: "1px solid var(--border)",
                      background: view === "table" ? "rgba(11,11,12,0.06)" : "white",
                      color: "var(--ink)",
                    }}
                  >
                    Full table
                  </button>
                </div>
              </div>

              {error && (
                <p className="mt-3 text-sm" style={{ color: "crimson" }}>
                  {error}
                </p>
              )}

              <div className="mt-3 text-xs" style={{ color: "var(--ink-soft)" }}>
                Showing <strong>{filtered.length}</strong> orders • Remaining pickups:{" "}
                <strong>{totals.notPickedUp}</strong>
              </div>
            </div>

            {/* Pickup list view */}
            {view === "pickup" ? (
              <div className="grid gap-3">
                {filtered.length === 0 ? (
                  <div className="rounded-3xl p-5" style={{ border: "1px solid var(--border)" }}>
                    <p style={{ color: "var(--ink-soft)" }}>No orders found.</p>
                  </div>
                ) : (
                  filtered.map((o) => (
                    <div key={o._id} className="rounded-3xl p-5" style={{ border: "1px solid var(--border)", ...tint(o) }}>
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="font-extrabold" style={{ color: "var(--ink)" }}>
                          {o.customer?.name || "Unnamed"}
                        </div>
                        <div className="text-sm" style={{ color: "var(--ink-soft)" }}>
                          {o.customer?.phone || "No phone"}
                        </div>
                        <div className="text-sm" style={{ color: "var(--ink-soft)" }}>
                          Pepper: <span style={{ color: "var(--ink)" }}>{o.customer?.pepper || "mild"}</span>
                        </div>

                        <div className="ml-auto flex items-center gap-2">
                          <div className="text-sm font-semibold" style={{ color: "var(--ink)" }}>
                            {formatAUD(o.totalCents || 0)}
                          </div>

                          <button
                            type="button"
                            onClick={() => togglePickedUp(o._id, !o.pickedUp)}
                            className="rounded-2xl px-4 py-2 font-semibold"
                            style={{
                              border: "1px solid var(--border)",
                              background: o.pickedUp ? "rgba(34,197,94,0.14)" : "rgba(11,11,12,0.04)",
                              color: "var(--ink)",
                            }}
                          >
                            {o.pickedUp ? "Picked up ✅" : "Mark picked up"}
                          </button>
                        </div>
                      </div>

                      <div className="mt-3 grid gap-1 text-sm" style={{ color: "var(--ink)" }}>
                        {(o.items || []).map((it, idx) => (
                          <div key={idx}>
                            {it.quantity} × {it.name}{" "}
                            <span style={{ color: "var(--ink-soft)" }}>(pack {it.packSize || 6})</span>
                          </div>
                        ))}
                      </div>

                      {o.customer?.notes ? (
                        <div className="mt-3 text-xs" style={{ color: "var(--ink-soft)" }}>
                          Notes: {o.customer.notes}
                        </div>
                      ) : null}
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="overflow-x-auto rounded-3xl" style={{ border: "1px solid var(--border)" }}>
                <table className="w-full text-sm">
                  <thead style={{ background: "rgba(11,11,12,0.03)" }}>
                    <tr>
                      <th className="text-left p-4">Customer</th>
                      <th className="text-left p-4">Phone</th>
                      <th className="text-left p-4">Pepper</th>
                      <th className="text-left p-4">Items</th>
                      <th className="text-left p-4">Total</th>
                      <th className="text-left p-4">Status</th>
                      <th className="text-left p-4">Picked up</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td className="p-4" colSpan={7} style={{ color: "var(--ink-soft)" }}>
                          No orders found.
                        </td>
                      </tr>
                    ) : (
                      filtered.map((o) => (
                        <tr key={o._id} style={{ borderTop: "1px solid var(--border)", ...tint(o) }}>
                          <td className="p-4 font-semibold" style={{ color: "var(--ink)" }}>
                            {o.customer?.name}
                          </td>
                          <td className="p-4" style={{ color: "var(--ink)" }}>
                            {o.customer?.phone}
                          </td>
                          <td className="p-4" style={{ color: "var(--ink)" }}>
                            {o.customer?.pepper || "mild"}
                          </td>
                          <td className="p-4" style={{ color: "var(--ink)" }}>
                            <div className="grid gap-1">
                              {(o.items || []).map((it, idx) => (
                                <div key={idx}>
                                  {it.quantity} × {it.name}{" "}
                                  <span style={{ color: "var(--ink-soft)" }}>(pack {it.packSize || 6})</span>
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="p-4 font-extrabold" style={{ color: "var(--ink)" }}>
                            {formatAUD(o.totalCents || 0)}
                          </td>
                          <td className="p-4" style={{ color: "var(--ink)" }}>
                            {o.status}
                          </td>
                          <td className="p-4">
                            <button
                              type="button"
                              onClick={() => togglePickedUp(o._id, !o.pickedUp)}
                              className="rounded-2xl px-4 py-2 font-semibold"
                              style={{
                                border: "1px solid var(--border)",
                                background: o.pickedUp ? "rgba(34,197,94,0.12)" : "rgba(11,11,12,0.03)",
                                color: "var(--ink)",
                              }}
                            >
                              {o.pickedUp ? "Picked up ✅" : "Mark picked up"}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            <div className="text-xs" style={{ color: "var(--ink-soft)" }}>
              Colors: amber = not picked up • green = picked up • red = cancelled
            </div>
          </div>
        </Container>
      </main>
    </div>
  )
}