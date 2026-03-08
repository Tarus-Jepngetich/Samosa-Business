import { useMemo, useState } from "react"
import { Link } from "react-router-dom"

import Container from "../components/layout/container"
import QuantityStepper from "../components/QuantityStepper"
import CustomerForm from "../components/CustomerForm"
import StripeButton from "../components/ui/StripeButton"
import EventNotice from "../components/EventsNotice"

import { PRODUCTS } from "../data/products"
import { formatAUD } from "../utils/money"
import { pickupWindowText, preorderWindowText } from "../utils/rules"

import samoImg from "../assets/samo.png"

export default function Order() {
  const [cart, setCart] = useState(() =>
    Object.fromEntries(PRODUCTS.map((p) => [p.id, 0]))
  )
  const [customer, setCustomer] = useState({ name: "", phone: "",  pepper: "no_pepper", notes: "" })

  const lines = useMemo(() => {
    return PRODUCTS.map((p) => {
      const qty = cart[p.id] ?? 0
      const lineTotal = qty * p.priceCents
      return { ...p, qty, lineTotal }
    })
  }, [cart])

  const totalCents = useMemo(
    () => lines.reduce((sum, l) => sum + l.lineTotal, 0),
    [lines]
  )

  const totalItems = useMemo(
    () => lines.reduce((sum, l) => sum + l.qty * l.packSize, 0),
    [lines]
  )

  function setQty(id, next) {
    setCart((c) => ({ ...c, [id]: Math.max(0, next) }))
  }

  const nameOk = customer.name.trim().length >= 2
  const phoneOk = customer.phone.trim().length >= 8
  const canContinue = totalCents > 0 && nameOk && phoneOk
const handleCheckout = async (e) => {
  e?.preventDefault?.()

  try {
    const items = lines
      .filter((l) => l.qty > 0)
      .map((l) => ({
        productId: l.id,
        name: l.name,
        unitPriceCents: l.priceCents,
        quantity: l.qty,
        packSize: l.packSize,
      }))

    const API_URL = import.meta.env.VITE_API_URL

const res = await fetch(`${API_URL}/api/payment/create-checkout-session`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ customer, items }),
})
    const data = await res.json()
    if (!res.ok) throw new Error(data?.error || "Checkout failed")
    if (!data?.url) throw new Error("No Stripe checkout URL returned")

    window.location.assign(data.url)
  } catch (err) {
    console.error(err)
    alert(err.message)
  }
}

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b" style={{ borderColor: "var(--border)" }}>
        <Container>
          

         

          
        </Container>
      </header>

      <main>
        <Container>
          <div className="py-10 md:py-14">
            <h1 className="text-3xl font-extrabold" style={{ color: "var(--ink)" }}>
              Choose your packs
            </h1>
            <p className="mt-2" style={{ color: "var(--ink-soft)" }}>
              Each item is sold in packs of 6.
            </p>
           
            
            <div className="mt-10 grid gap-8 md:grid-cols-[1.2fr_0.8fr]">
              {/* Products */}
              <section className="grid gap-4">
                {lines.map((p) => (
                  <div
                    key={p.id}
                    className="rounded-3xl bg-white p-5 md:p-6 shadow-sm card-hover"
                    style={{ border: "1px solid var(--border)" }}
                  >
                    <div className="grid gap-5 md:grid-cols-[160px_1fr_auto] md:items-center">
                      {/* Image */}
                      <div
                        className="overflow-hidden rounded-2xl"
                        style={{ border: "1px solid var(--border)" }}
                      >
                        <img src={samoImg} alt="Samosas" className="h-32 w-full object-cover" />
                      </div>

                      {/* Info */}
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-lg font-extrabold" style={{ color: "var(--ink)" }}>
                            {p.name}
                          </p>

                          <span
                            className="rounded-full px-3 py-1 text-[11px] font-semibold"
                            style={{
                              background: "rgba(11,11,12,0.04)",
                              border: "1px solid var(--border)",
                              color: "var(--ink)",
                            }}
                          >
                            Pack of {p.packSize}
                          </span>
                        </div>

                        <p className="mt-1 text-sm" style={{ color: "var(--ink-soft)" }}>
                          {p.description}
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-3">
                          <p className="text-sm font-bold" style={{ color: "var(--ink)" }}>
                            {formatAUD(p.priceCents)} / pack
                          </p>

                          <span className="text-xs" style={{ color: "var(--ink-soft)" }}>
                            <li>Pickup Saturday 2:00–10:00pm</li>
                            <li>If its for event contact us for booking</li>
                            <li>If you prefer delivery, you may arrange and cover the Uber delivery fee and we will hand the order to the driver..</li>
                          </span>
                        </div>

                        {p.qty > 0 && (
                          <div
                            className="mt-3 inline-flex items-center gap-2 rounded-2xl px-3 py-2"
                            style={{
                              background: "rgba(11,11,12,0.04)",
                              border: "1px solid var(--border)",
                            }}
                          >
                            <span className="text-xs" style={{ color: "var(--ink-soft)" }}>
                              Line total
                            </span>
                            <span className="text-sm font-extrabold" style={{ color: "var(--ink)" }}>
                              {formatAUD(p.lineTotal)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Stepper */}
                      <div className="md:justify-self-end">
                        <QuantityStepper
                          value={p.qty}
                          onDec={() => setQty(p.id, p.qty - 1)}
                          onInc={() => setQty(p.id, p.qty + 1)}
                        />
                        <p className="mt-2 text-center text-xs" style={{ color: "var(--ink-soft)" }}>
                          packs
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </section>

              {/* Cart */}
              <aside
                className="grid gap-4 h-fit rounded-3xl bg-white p-6 shadow-sm md:sticky md:top-6"
                style={{ border: "1px solid var(--border)" }}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-extrabold" style={{ color: "var(--ink)" }}>
                    Checkout
                  </p>
                  <span
                    className="rounded-full px-3 py-1 text-[11px] font-semibold"
                    style={{ border: "1px solid var(--border)", color: "var(--ink)" }}
                  >
                    Pickup only
                  </span>
                </div>

                <EventNotice />

                <CustomerForm customer={customer} setCustomer={setCustomer} />

                <p className="text-sm font-extrabold" style={{ color: "var(--ink)" }}>
                  Your cart
                </p>

                <div className="grid gap-3">
                  {lines.every((l) => l.qty === 0) ? (
                    <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
                      No packs yet — add some on the left.
                    </p>
                  ) : (
                    lines
                      .filter((l) => l.qty > 0)
                      .map((l) => (
                        <div key={l.id} className="flex items-center justify-between text-sm">
                          <span style={{ color: "var(--ink)" }}>
                            {l.qty} × {l.name}
                          </span>
                          <span className="font-extrabold" style={{ color: "var(--ink)" }}>
                            {formatAUD(l.lineTotal)}
                          </span>
                        </div>
                      ))
                  )}
                </div>

                <div className="h-px" style={{ background: "rgba(11,11,12,0.12)" }} />

                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: "var(--ink-soft)" }}>
                    Total ({totalItems} samosas)
                  </span>
                  <span className="text-lg font-extrabold" style={{ color: "var(--ink)" }}>
                    {formatAUD(totalCents)}
                  </span>
                </div>

                <div
                  className="rounded-2xl p-4"
                  style={{
                    border: "1px dashed var(--border)",
                    background: "rgba(11,11,12,0.03)",
                  }}
                >
                  <p className="text-xs font-semibold" style={{ color: "var(--ink-soft)" }}>
                    Estimated pickup
                  </p>
                  <p className="mt-1 text-sm font-extrabold" style={{ color: "var(--ink)" }}>
                    Saturday, 2:00–10:00pm
                  </p>
                </div>

                
                  <button
  type="button"
  disabled={!canContinue}
  onClick={handleCheckout}
  className="bg-yellow-500 text-white px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
>
  Pay with Card
</button>
                

                {!canContinue && (
                  <p className="text-xs" style={{ color: "var(--ink-soft)" }}>
                    Add packs + enter your name and phone to continue.
                  </p>
                )}

                <p className="text-xs" style={{ color: "var(--ink-soft)" }}>
                  You’ll get a confirmation after payment.
                </p>
              </aside>
            </div>
          </div>
        </Container>
      </main>
    </div>
  )
}