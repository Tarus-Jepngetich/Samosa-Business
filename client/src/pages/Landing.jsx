import { useNavigate } from "react-router-dom"
import Container from "../components/layout/container"
import samoImg from "../assets/samo.png"
import { Link } from "react-router-dom"

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white">
      {/* Top bar */}
      <header className="border-b" style={{ borderColor: "var(--border)" }}>
        <Container>
          <div className="flex items-center justify-between py-5">
            <div className="flex items-center gap-3">
              <div
                className="h-10 w-10 rounded-2xl"
                style={{ background: "var(--ink)" }}
              />
              <div>
                <p className="text-sm font-semibold">Samosa Weekend</p>
                <p className="text-xs" style={{ color: "var(--ink-soft)" }}>
                  Preorder before Friday • Pickup Saturday afternoon
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/order")}
              className="rounded-2xl px-4 py-2 text-sm font-semibold"
              style={{
                background: "var(--ink)",
                color: "white",
                border: "1px solid var(--border)",
              }}
            >
              Start Order
            </button>
          </div>
        </Container>
      </header>

      <main>
        <Container>
          {/* Hero */}
          <section className="py-10 md:py-14">
            <section className="relative overflow-hidden rounded-3xl border border-[var(--border)]">
              <div className="grid md:grid-cols-2">
                {/* LEFT (white) */}
                <div className="bg-white p-8 md:p-10 relative z-10">
                  <span
                    className="inline-flex text-xs font-semibold px-3 py-1 rounded-full"
                    style={{ border: "1px solid var(--border)" }}
                  >
                    Weekly drops • Saturday
                  </span>

                  <h1 className="mt-4 text-4xl md:text-5xl font-extrabold leading-tight">
                    Crispy samosas, fresh.
                  </h1>

                  <p className="mt-4 text-base md:text-lg" style={{ color: "var(--ink-soft)" }}>
                    Book your packs by Friday, pay securely, and pick up Saturday afternoon.
                  </p>

                  <div className="mt-7 flex flex-wrap gap-3">
                    <button
                      onClick={() => navigate("/order")}
                      className="rounded-2xl px-6 py-3 font-semibold"
                      style={{ background: "var(--ink)", color: "white" }}
                    >
                      Preorder Now
                    </button>

                    <button
                      onClick={() => {
                        const el = document.getElementById("how-pickup-works")
                        el?.scrollIntoView({ behavior: "smooth" })
                      }}
                      className="rounded-2xl px-6 py-3 font-semibold"
                      style={{
                        background: "white",
                        color: "var(--ink)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      How pickup works
                    </button>
                  </div>

                  {/* Samosa image (slightly nudged into the wave) */}
                  <img
                    src={samoImg}
                    alt="Samosa plate"
                    className="mt-10 w-full max-w-[420px] rounded-3xl shadow-xl relative z-20"
                    style={{
                      border: "1px solid var(--border)",
                      transform: "translateX(18px)",
                    }}
                  />

                  <p className="mt-3 text-xs" style={{ color: "var(--ink-soft)" }}>
                    Pickup only • Saturday afternoon
                  </p>
                </div>

                {/* RIGHT (black) */}
                <div className="bg-black text-white p-8 md:p-10 flex flex-col justify-center relative">
                  {/* Wave Divider */}
                  <div className="absolute left-0 top-0 h-full w-24 overflow-hidden pointer-events-none">
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
                      <path
                        d="M100 0 C40 20 60 40 20 50 C60 60 40 80 100 100 L0 100 L0 0 Z"
                        fill="white"
                      />
                    </svg>
                  </div>

                  <div className="ml-8 md:ml-10">
                    <p className="text-sm font-semibold">This week’s packs</p>

                    <div className="mt-5 space-y-3">
                      <div className="border border-white/30 rounded-2xl p-4">
                        <p className="font-semibold">Classic Beef Samosa</p>
                        <p className="text-sm opacity-80">A$25 / pack of 6</p>
                      </div>

                      <div className="border border-white/30 rounded-2xl p-4">
                        <p className="font-semibold">Chicken Samosa</p>
                        <p className="text-sm opacity-80">A$25 / pack of 6</p>
                      </div>

                      <div className="border border-white/30 rounded-2xl p-4">
                        <p className="font-semibold">Veggie Samosa</p>
                        <p className="text-sm opacity-80">A$25 / pack of 6</p>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate("/order")}
                      className="mt-6 w-full rounded-2xl px-5 py-3 font-semibold"
                      style={{ background: "white", color: "black" }}
                    >
                      Choose quantity →
                    </button>

                    <p className="mt-3 text-xs opacity-80">
                      Thank you for supporting our small business. We hope you enjoy your samosas!🙂
                    </p>
                  </div>
                </div>
              </div>
            </section>
{/* Ordering timeline */}
<section
id="how-pickup-works"
  className="mt-8 rounded-3xl bg-white p-6"
  style={{ border: "1px solid var(--border)" }}
>
  <div className="flex items-center justify-between gap-4 flex-wrap">
    <h2 className="text-lg font-extrabold" style={{ color: "var(--ink)" }}>
      How it works
    </h2>
    <span
      className="rounded-full px-3 py-1 text-xs font-semibold"
      style={{ border: "1px solid var(--border)", color: "var(--ink)" }}
    >
      Simple 3-step pickup
    </span>
  </div>

  <div className="mt-5 grid gap-3 md:grid-cols-3">
    {[
      {
        title: "Order byFriday",
        desc: "Choose your packs and submit your preorder.",
        icon: "🗓️",
      },
      {
        title: "Pay Securely",
        desc: "Checkout online (Stripe).",
        icon: "🔒",
      },
      {
        title: "Pickup Saturday",
        desc: "Collect your order 12:00–4:00pm.",
        icon: "📦",
      },
    ].map((s) => (
      <div
        key={s.title}
        className="rounded-3xl p-5"
        style={{
          border: "1px solid var(--border)",
          background: "rgba(11,11,12,0.03)",
        }}
      >
        <div className="flex items-start gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-2xl text-lg"
            style={{ border: "1px solid var(--border)", background: "white" }}
          >
            {s.icon}
          </div>
          <div>
            <p className="font-extrabold" style={{ color: "var(--ink)" }}>
              {s.title}
            </p>
            <p className="mt-1 text-sm" style={{ color: "var(--ink-soft)" }}>
              {s.desc}
            </p>
          </div>
        </div>
      </div>
    ))}
  </div>
</section>
            
          </section>
        </Container>
        <div className="text-center mt-10">
  <Link
    to="/admin/login"
    className="text-xs text-gray-400 hover:text-gray-600"
  >
    © Samosa Shop · Admin
  </Link>
</div>
      </main>
    </div>
  )
}