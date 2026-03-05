export default function EventNotice() {
  return (
    <div
      className="rounded-3xl p-5"
      style={{
        border: "1px solid var(--border)",
        background: "rgba(11,11,12,0.03)",
      }}
    >
      <p className="text-sm font-extrabold" style={{ color: "var(--ink)" }}>
        Planning an event or need a weekday order?
      </p>
      <p className="mt-2 text-sm" style={{ color: "var(--ink-soft)" }}>
        We can make custom batches for events and weekday pickups.
        Call or text us
        to arrange.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <a
          href="tel:0424803187"
          className="rounded-2xl px-4 py-2 text-sm font-semibold"
          style={{ background: "var(--ink)", color: "white" }}
        >
          Call now
        </a>
        </div>
         <div className="mt-4 flex flex-wrap gap-2">
        <span
          className="rounded-2xl px-4 py-2 text-sm font-semibold"
          style={{ border: "1px solid var(--border)", color: "var(--ink)" }}
        >
          Weekday bookings
        </span>
         
         <span
          className="rounded-2xl px-4 py-2 text-sm font-semibold"
          style={{ border: "1px solid var(--border)", color: "var(--ink)" }}
        >
          Event catering
        </span>
        
       
      </div>
    </div>
  )
}