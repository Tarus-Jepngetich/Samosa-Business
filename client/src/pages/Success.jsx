import { useEffect, useMemo, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import Container from "../components/layout/container"
import { formatAUD } from "../utils/money"

const API_BASE = import.meta.env.VITE_API_URL || ""

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

        if (!sessionId) {
          throw new Error("Missing session_id in the URL.")
        }

        const res = await fetch(`${API_BASE}/api/orders/by-session/${sessionId}`)
        const contentType = res.headers.get("content-type") || ""

        if (!res.ok) {
          let message = `Request failed (${res.status})`

          try {
            if (contentType.includes("application/json")) {
              const json = await res.json()
              message = json?.message || json?.error || message
            } else {
              const text = await res.text()
              if (text) message = text
            }
          } catch {
            // keep fallback message
          }

          throw new Error(message)
        }

        if (!contentType.includes("application/json")) {
          const text = await res.text()
          throw new Error(
            `Expected JSON but received HTML/text instead. Check your backend route or Vite proxy. ${text.slice(0, 80)}`
          )
        }

        const json = await res.json()
        if (alive) setData(json)
      } catch (e) {
        if (alive) setError(e?.message || "Something went wrong")
      } finally {
        if (alive) setLoading(false)
      }
    }

    load()

    return () => {
      alive = false
    }
  }, [sessionId])

  const order = useMemo(() => {
    if (!data) return null
    return data.order ?? data
  }, [data])

  const customerName =
    order?.customer?.name ??
    order?.customerName ??
    order?.name ??
    order?.customer?.fullName ??
    "Customer"

  const customerPhone = order?.customer?.phone ?? "—"
  const customerPepper = order?.customer?.pepper ?? "—"
  const customerNotes = order?.customer?.notes ?? ""

  const items = order?.items ?? []

  const totalCents =
    order?.totalCents ??
    items.reduce((sum, it) => sum + (it?.lineTotalCents ?? 0), 0)

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b" style={{ borderColor: "var(--border)" }}>
        <Container>
          <div className="flex items-center justify-between py-6">
            <div>
              <p
                className="text-xs tracking-[0.35em] uppercase"
                style={{ color: "var(--ink-soft)" }}
              >
                Payment Status
              </p>
              <h1
                className="text-2xl font-extrabold"
                style={{ color: "var(--ink)" }}
              >
                {loading ? "Loading..." : error ? "Couldn’t load your order" : "Order confirmed"}
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
              <div
                className="rounded-3xl p-6"
                style={{ border: "1px solid var(--border)" }}
              >
                <p style={{ color: "var(--ink-soft)" }}>
                  Fetching your order details…
                </p>
              </div>
            )}

            {!loading && error && (
              <div
                className="rounded-3xl p-6"
                style={{ border: "1px solid var(--border)" }}
              >
                <p className="font-bold" style={{ color: "var(--ink)" }}>
                  Couldn’t load your order
                </p>
                <p className="mt-2 text-sm" style={{ color: "var(--ink-soft)" }}>
                  {error}
                </p>
                <p className="mt-4 text-xs" style={{ color: "var(--ink-soft)" }}>
                  Tip: check your backend route for this session_id:{" "}
                  <span style={{ color: "var(--ink)" }}>{sessionId || "—"}</span>
                </p>
              </div>
            )}

            {!loading && !error && (
              <>
                <div
                  className="rounded-3xl p-6"
                  style={{ border: "1px solid var(--border)" }}
                >
                  <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
                    Thank you,{" "}
                    <span style={{ color: "var(--ink)", fontWeight: 800 }}>
                      {customerName}
                    </span>{" "}
                    ✅
                  </p>
                  <p className="mt-2 text-sm" style={{ color: "var(--ink-soft)" }}>
                    We’ve received your order successfully.
                  </p>
                </div>

                <div
                  className="rounded-3xl p-6"
                  style={{ border: "1px solid var(--border)" }}
                >
                  <p
                    className="font-extrabold text-lg"
                    style={{ color: "var(--ink)" }}
                  >
                    Order summary
                  </p>

                  <div className="mt-4 space-y-2 text-sm" style={{ color: "var(--ink-soft)" }}>
                    <p>
                      <span style={{ color: "var(--ink)", fontWeight: 700 }}>Name:</span>{" "}
                      {customerName}
                    </p>
                    <p>
                      <span style={{ color: "var(--ink)", fontWeight: 700 }}>Phone:</span>{" "}
                      {customerPhone}
                    </p>
                    <p>
                      <span style={{ color: "var(--ink)", fontWeight: 700 }}>Pepper:</span>{" "}
                      {customerPepper}
                    </p>
                    {customerNotes ? (
                      <p>
                        <span style={{ color: "var(--ink)", fontWeight: 700 }}>Notes:</span>{" "}
                        {customerNotes}
                      </p>
                    ) : null}
                  </div>

                  <ul className="mt-6 space-y-3">
                    {items.map((it, idx) => {
                      const name = it?.name ?? it?.product?.name ?? "Item"
                      const qty = it?.quantity ?? it?.qty ?? 1
                      const lineTotal = it?.lineTotalCents ?? 0

                      return (
                        <li
                          key={it?._id ?? it?.productId ?? idx}
                          className="flex items-center justify-between text-sm"
                          style={{ color: "var(--ink-soft)" }}
                        >
                          <span>
                            <span style={{ color: "var(--ink)", fontWeight: 700 }}>
                              {name}
                            </span>{" "}
                            × {qty}
                          </span>
                          <span style={{ color: "var(--ink)", fontWeight: 700 }}>
                            {formatAUD(lineTotal / 100)}
                          </span>
                        </li>
                      )
                    })}
                  </ul>

                  <div className="mt-6 flex items-center justify-between border-t pt-4" style={{ borderColor: "var(--border)" }}>
                    <span className="text-sm font-bold" style={{ color: "var(--ink-soft)" }}>
                      Total
                    </span>
                    <span className="text-lg font-extrabold" style={{ color: "var(--ink)" }}>
                      {formatAUD(totalCents / 100)}
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