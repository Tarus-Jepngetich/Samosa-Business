import { Link, useSearchParams } from "react-router-dom"
import Container from "../components/layout/container"

export default function Success() {
  const [params] = useSearchParams()
  const sessionId = params.get("session_id")

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
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M20 6L9 17l-5-5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <div className="flex-1">
                  <h1 className="text-2xl md:text-3xl font-extrabold" style={{ color: "var(--ink)" }}>
                    Order confirmed. Yaaas!
                  </h1>
                  <p className="mt-2 text-sm md:text-base" style={{ color: "var(--ink-soft)" }}>
                    Asante sana for shopping with us. We appreciate your support — your samosas are now
                    booked and will be ready for pickup on Saturday!
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
                <p className="text-xs font-semibold" style={{ color: "var(--ink-soft)" }}>
                  Pickup Instructions
                </p>

                <p className="mt-2 text-lg font-extrabold" style={{ color: "var(--ink)" }}>
                  Saturday, 12:00 – 4:00pm
                </p>

                <ul className="mt-4 list-disc pl-5 text-sm leading-6" style={{ color: "var(--ink-soft)" }}>
                  <li>
                    <span className="font-semibold" style={{ color: "var(--ink)" }}>
                      Address:
                    </span>{" "}
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=2A+Franke+Ct+Kingston+4114"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-4 font-semibold"
                      style={{ color: "var(--ink)" }}
                    >
                      2A Franke Ct Kingston 4114
                    </a>
                  </li>

                  <li>
                    <span className="font-semibold" style={{ color: "var(--ink)" }}>
                      Bring:
                    </span>{" "}
                    Identification
                  </li>

                  <li>
                    <span className="font-semibold" style={{ color: "var(--ink)" }}>
                      Pickup only:
                    </span>{" "}
                    No delivery. If you prefer delivery, you may arrange and cover the Uber delivery fee
                    and we’ll hand the order to the driver.
                  </li>
                </ul>

                <p className="mt-4 text-sm" style={{ color: "var(--ink-soft)" }}>
                  You will receive an SMS confirmation shortly.
                </p>
              </div>

              {sessionId && (
                <p className="mt-6 text-xs" style={{ color: "var(--ink-soft)" }}>
                  Payment reference: <span style={{ color: "var(--ink)" }}>{sessionId}</span>
                </p>
              )}

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/"
                  className="rounded-2xl px-6 py-3 font-semibold"
                  style={{ background: "var(--ink)", color: "white" }}
                >
                  Back to Home
                </Link>

                <Link
                  to="/order"
                  className="rounded-2xl px-6 py-3 font-semibold"
                  style={{ border: "1px solid var(--border)", color: "var(--ink)" }}
                >
                  Make another order
                </Link>
              </div>

              <p className="mt-6 text-xs" style={{ color: "var(--ink-soft)" }}>
                Need a weekday order or event catering? Call/text{" "}
                <a
                  href="tel:0424803187"
                  className="font-extrabold underline underline-offset-4"
                  style={{ color: "var(--ink)" }}
                >
                  here
                </a>
                .
              </p>
            </div>
          </div>
        </Container>
      </main>
    </div>
  )
}