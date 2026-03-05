export default function CustomerForm({ customer, setCustomer }) {
  function update(field, value) {
    setCustomer((c) => ({ ...c, [field]: value }))
  }

  return (
    <div
      className="rounded-3xl bg-white p-6 shadow-sm"
      style={{ border: "1px solid var(--border)" }}
    >
      <p className="text-sm font-semibold" style={{ color: "var(--chai-brown)" }}>
        Your details
      </p>

      <div className="mt-4 grid gap-4">
        <label className="grid gap-2">
          <span className="text-sm" style={{ color: "var(--ink-soft)" }}>
            Full name
          </span>
          <input
            value={customer.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="e.g., First & Last Name"
            className="w-full rounded-2xl px-4 py-3 outline-none"
            style={{ border: "1px solid var(--border)" }}
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm" style={{ color: "var(--ink-soft)" }}>
            Phone number
          </span>
          <input
            value={customer.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="e.g., 04xx xxx xxx"
            className="w-full rounded-2xl px-4 py-3 outline-none"
            style={{ border: "1px solid var(--border)" }}
          />
        </label>
<label className="grid gap-2">
  <span className="text-sm" style={{ color: "var(--ink-soft)" }}>
    Pepper level
  </span>

  <div className="grid grid-cols-3 gap-2">
    {[
      { key: "none", label: "No pepper" },
      { key: "mild", label: "Mild" },
      { key: "hot", label: "Hot" },
    ].map((opt) => {
      const active = customer.pepper === opt.key
      return (
        <button
          key={opt.key}
          type="button"
          onClick={() => setCustomer((c) => ({ ...c, pepper: opt.key }))}
          className="rounded-2xl px-3 py-3 text-sm font-semibold"
          style={{
            border: "1px solid var(--border)",
            background: active ? "var(--ink)" : "white",
            color: active ? "white" : "var(--ink)",
          }}
        >
          {opt.label}
        </button>
      )
    })}
  </div>

  <p className="text-xs" style={{ color: "var(--ink-soft)" }}>
    Choose one option for the whole order.
  </p>
</label>
        <label className="grid gap-2">
          <span className="text-sm" style={{ color: "var(--ink-soft)" }}>
            Notes (optional)
          </span>
          <textarea
            value={customer.notes}
            onChange={(e) => update("notes", e.target.value)}
            placeholder="Any allergies or special requests?"
            rows={3}
            className="w-full resize-none rounded-2xl px-4 py-3 outline-none"
            style={{ border: "1px solid var(--border)" }}
          />
        </label>
      </div>
    </div>
  )
}