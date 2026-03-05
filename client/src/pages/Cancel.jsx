import { Link } from "react-router-dom"
import Container from "../components/layout/container"

export default function Cancel() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b" style={{ borderColor: "var(--border)" }}>
        <Container>
          <div className="flex items-center justify-between py-5">
            <p className="text-sm font-extrabold" style={{ color: "var(--ink)" }}>
              Samosa Friday
            </p>

            <Link
              to="/"
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl"
              style={{ border: "1px solid var(--border)", color: "var(--ink)" }}
              aria-label="Home"
            >
              🏠
            </Link>
          </div>
        </Container>
      </header>

      <main>
        <Container>
          <div className="py-12 md:py-16">
            <div
              className="mx-auto max-w-2xl rounded-3xl bg-white p-8 md:p-10 shadow-sm"
              style={{ border: "1px solid var(--border)" }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl"
                  style={{
                    border: "1px solid var(--border)",
                    background: "rgba(11,11,12,0.03)",
                  }}
                >
                  ❌
                </div>

                <div>
                  <h1
                    className="text-2xl md:text-3xl font-extrabold"
                    style={{ color: "var(--ink)" }}
                  >
                    Payment cancelled
                  </h1>

                  <p
                    className="mt-2 text-sm md:text-base"
                    style={{ color: "var(--ink-soft)" }}
                  >
                    No worries 🙂 Your order was not placed.
                  </p>
                </div>
              </div>

              <div
                className="mt-8 rounded-3xl p-6"
                style={{
                  border: "1px dashed var(--border)",
                  background: "rgba(11,11,12,0.03)",
                }}
              >
                <p
                  className="text-sm"
                  style={{ color: "var(--ink-soft)" }}
                >
                  You can go back and adjust your order or try checkout again.
                </p>
              </div>

              <div className="mt-8 flex gap-3 flex-wrap">
                <Link
                  to="/order"
                  className="rounded-2xl px-6 py-3 font-semibold"
                  style={{ background: "var(--ink)", color: "white" }}
                >
                  Return to Order
                </Link>

                <Link
                  to="/"
                  className="rounded-2xl px-6 py-3 font-semibold"
                  style={{
                    border: "1px solid var(--border)",
                    color: "var(--ink)",
                  }}
                >
                  Back to Home
                </Link>
              </div>

              <p className="mt-6 text-xs" style={{ color: "var(--ink-soft)" }}>
                Need help or want to place an event order? Call or text{" "}
                <a
                  href="tel:0424803187"
                  className="font-bold underline"
                  style={{ color: "var(--ink)" }}
                >
                  0424 803 187
                </a>
              </p>
            </div>
          </div>
        </Container>
      </main>
    </div>
  )
}