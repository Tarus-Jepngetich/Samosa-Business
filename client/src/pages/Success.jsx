import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import Container from "../components/layout/container"
import QuantityStepper from "../components/QuantityStepper"
import CustomerForm from "../components/CustomerForm"
import StripeButton from "../components/ui/StripeButton"
import EventNotice from "../components/EventsNotice"
import { PRODUCTS } from "../data/products"
import { formatAUD } from "../utils/money"

// ✅ Australia/Brisbane time (AEST/AEDT safe via Intl)
const TZ = "Australia/Brisbane"

// Orders close: Friday 2:00 PM (local Brisbane time)
// Orders reopen: Sunday 12:00 AM (start of day)
function getOrderWindowStatus(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-AU", {
    timeZone: TZ,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now)

  const weekday = parts.find((p) => p.type === "weekday")?.value // e.g. "Fri"
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0)
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? 0)

  const mins = hour * 60 + minute

  // Closed from Fri 14:00 -> Sat all day -> until Sun 00:00
  const isFriAfter2pm = weekday === "Fri" && mins >= 14 * 60
  const isSaturday = weekday === "Sat"
  const isBeforeSunday = isFriAfter2pm || isSaturday

  // If it's Sunday or later in the week (Mon–Fri before 2pm), it's open
  const isOpen = !isBeforeSunday && !(weekday === "Sun" && mins < 0) // (always false, just clarity)

  return {
    isOpen,
    weekday,
    hour,
    minute,
  }
}

export default function Order() {
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    notes: "",
  })

  const [cart, setCart] = useState(() =>
    PRODUCTS.map((p) => ({ ...p, qty: 0 }))
  )

  // ✅ Evaluate “open/closed” at render time
  const { isOpen } = useMemo(() => getOrderWindowStatus(new Date()), [])

  const items = useMemo(() => cart.filter((p) => p.qty > 0), [cart])

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.qty, 0),
    [items]
  )

  const onQtyChange = (id, nextQty) => {
    setCart((prev) => prev.map((p) => (p.id === id ? { ...p, qty: nextQty } : p)))
  }

  const canPay =
    isOpen &&
    items.length > 0 &&
    customer.name.trim() &&
    customer.phone.trim()

  return (
    <div className="min-h-screen bg-white">
      {/* ✅ Orders Closed Banner */}
      {!isOpen && (
        <div
          className="border-b"
          style={{
            borderColor: "var(--border)",
            background: "rgba(11,11,12,0.03)",
          }}
        >
          <Container>
            <div className="py-4">
              <p className="text-sm font-extrabold" style={{ color: "var(--ink)" }}>
                Orders closed for this week
              </p>
              <p className="mt-1 text-xs" style={{ color: "var(--ink-soft)" }}>
                Preorders close every Friday at <span style={{ color: "var(--ink)" }}>2:00 PM</span>{" "}
                and reopen on <span style={{ color: "var(--ink)" }}>Sunday</span>.
              </p>
            </div>
          </Container>
        </div>
      )}

      <header className="border-b" style={{ borderColor: "var(--border)" }}>
        <Container>
          <div className="flex items-center justify-between py-6">
            <div>
              <p className="text-xs tracking-[0.35em] uppercase" style={{ color: "var(--ink-soft)" }}>
                Weekly Preorders
              </p>
              <h1 className="text-2xl font-extrabold" style={{ color: "var(--ink)" }}>
                Place your order
              </h1>
            </div>

            <Link
              to="/"
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl"
              style={{ border: "1px solid var(--border)", color: "var(--ink)" }}
              aria-label="Home"
              title="Home"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 10.5L12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10.5z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </Container>
      </header>

      <main>
        <Container>
          <div className="py-10 md:py-12 space-y-8">
            <EventNotice />

            {/* Products */}
            <section className="space-y-4">
              {PRODUCTS.map((p) => {
                const line = cart.find((x) => x.id === p.id)
                const qty = line?.qty ?? 0

                return (
                  <div
                    key={p.id}
                    className="rounded-3xl p-6"
                    style={{ border: "1px solid var(--border)" }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-extrabold text-lg" style={{ color: "var(--ink)" }}>
                          {p.name}
                        </p>
                        <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
                          {p.description}
                        </p>
                        <p className="mt-2 text-sm font-bold" style={{ color: "var(--ink)" }}>
                          {formatAUD(p.price)}
                        </p>
                      </div>

                      <QuantityStepper
                        value={qty}
                        onChange={(next) => onQtyChange(p.id, next)}
                        disabled={!isOpen}
                      />
                    </div>
                  </div>
                )
              })}
            </section>

            {/* Customer form */}
            <section
              className="rounded-3xl p-6 md:p-8"
              style={{ border: "1px solid var(--border)" }}
            >
              <CustomerForm value={customer} onChange={setCustomer} disabled={!isOpen} />
            </section>

            {/* Summary + Pay */}
            <section
              className="rounded-3xl p-6 md:p-8"
              style={{ border: "1px solid var(--border)" }}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold" style={{ color: "var(--ink-soft)" }}>
                  Total
                </p>
                <p className="text-xl font-extrabold" style={{ color: "var(--ink)" }}>
                  {formatAUD(total)}
                </p>
              </div>

              {!isOpen && (
                <p className="mt-3 text-sm" style={{ color: "var(--ink-soft)" }}>
                  Orders are currently closed. They reopen on Sunday.
                </p>
              )}

              <div className="mt-6">
                <StripeButton
                  disabled={!canPay}
                  customer={customer}
                  items={items}
                />
              </div>

              {!canPay && isOpen && (
                <p className="mt-3 text-xs" style={{ color: "var(--ink-soft)" }}>
                  Add items + enter your name and phone number to enable payment.
                </p>
              )}
            </section>
          </div>
        </Container>
      </main>
    </div>
  )
}