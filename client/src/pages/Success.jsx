import { useEffect, useMemo, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import Container from "../components/layout/container"
import { formatAUD } from "../utils/money"

export default function Success() {
  const [params] = useSearchParams()
  const sessionId = params.get("session_id")

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let alive = true

    async function load() {
      try {
        setLoading(true)
        setError("")

        // ✅ Change this URL to your real endpoint:
        // e.g. /api/orders/by-session/:sessionId
        const res = await fetch(`/api/orders/by-session/${sessionId}`)
        if (!res.ok) throw new Error(`Request failed (${res.status})`)

        const json = await res.json()
        if (alive) setData(json)
      } catch (e) {
        if (alive) setError(e?.message || "Something went wrong")
      } finally {
        if (alive) setLoading(false)
      }
    }

    if (sessionId) load()
    else {
      setLoading(false)
      setError("Missing session_id in the URL.")
    }

    return () => {
      alive = false
    }
  }, [sessionId])

  // ✅ Works whether your backend returns {order: {...}} or just {...}
  const order = useMemo(() => {
    if (!data) return null
    return data.order ?? data
  }, [data])

  // ✅ The “.name fix” — never crashes
  const customerName =
    order?.customer?.name ??
    order?.customerName ??
    order?.name ??
    order?.customer?.fullName ??
    "Customer"

  const items = order?.items ?? order?.lineItems ?? []

  const total =
    order?.total ??
    order?.amountTotal ??
    items.reduce((sum, it) => sum + (it?.price ?? 0) * (it?.qty ?? 1), 0)

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b" style={{ borderColor: "var(--border)" }}>
        <Container>
          <div className="flex items-center justify-between py-6">
            <div>
              <p className="text-xs tracking-[0.35em] uppercase" style={{ color: "var(--ink-soft)" }}>
                Payment Status
              </p>
              <h1 className="text-2xl font-extrabold" style={{ color: "var(--ink)" }}>
                {loading ? "Loading..." : error ? "Oops" : "Order confirmed"}
              </h1>
            </div>

            <Link
              to="/"
              className="inline-flex h-10 items-center justify-center rounded-2xl px-4"
              style={{ border: "1px solid var(--border)", color: "var(--ink)" }}
            >
              Home
            </Link>
          </div>
        </Container>
      </header>

      <main>
        <Container>
          <div className="py-10 md:py-12 space-y-6">
            {loading && (
              <div className="rounded-3xl p-6" style={{ border: "1px solid var(--border)" }}>
                <p style={{ color: "var(--ink-soft)" }}>Fetching your order details…</p>
              </div>
            )}

            {!loading && error && (
              <div className="rounded-3xl p-6" style={{ border: "1px solid var(--border)" }}>
                <p className="font-bold" style={{ color: "var(--ink)" }}>Couldn’t load your order</p>
                <p className="mt-2 text-sm" style={{ color: "var(--ink-soft)" }}>{error}</p>
                <p className="mt-4 text-xs" style={{ color: "var(--ink-soft)" }}>
                  Tip: check your backend route for this session_id: <span style={{ color: "var(--ink)" }}>{sessionId}</span>
                </p>
              </div>
            )}

            {!loading && !error && (
              <>
                <div className="rounded-3xl p-6" style={{ border: "1px solid var(--border)" }}>
                  <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
                    Thank you, <span style={{ color: "var(--ink)", fontWeight: 800 }}>{customerName}</span> ✅
                  </p>
                  <p className="mt-2 text-sm" style={{ color: "var(--ink-soft)" }}>
                    We’ve received your order. Pickup details will be shown on the homepage.
                  </p>
                </div>

                <div className="rounded-3xl p-6" style={{ border: "1px solid var(--border)" }}>
                  <p className="font-extrabold" style={{ color: "var(--ink)" }}>Order summary</p>

                  <ul className="mt-4 space-y-2">
                    {(items ?? []).map((it, idx) => {
                      const name = it?.name ?? it?.product?.name ?? "Item"
                      const qty = it?.qty ?? it?.quantity ?? 1
                      return (
                        <li key={it?._id ?? it?.id ?? idx} className="text-sm" style={{ color: "var(--ink-soft)" }}>
                          <span style={{ color: "var(--ink)", fontWeight: 700 }}>{name}</span> × {qty}
                        </li>
                      )
                    })}
                  </ul>

                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-sm font-bold" style={{ color: "var(--ink-soft)" }}>Total</span>
                    <span className="text-lg font-extrabold" style={{ color: "var(--ink)" }}>
                      {formatAUD(Number(total || 0))}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </Container>
      </main>
    </div>
  )
}