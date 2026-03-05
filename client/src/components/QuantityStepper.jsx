export default function QuantityStepper({ value, onDec, onInc }) {
  return (
    <div
      className="inline-flex items-center overflow-hidden rounded-2xl bg-white"
      style={{ border: "1px solid var(--border)" }}
    >
      <button
        onClick={onDec}
        className="px-4 py-2 text-lg font-bold"
        style={{ color: "var(--chai-brown)" }}
        aria-label="Decrease quantity"
      >
        −
      </button>

     <div
  key={value} 
  className="min-w-10 px-3 py-2 text-center font-semibold qty-pop"
>
  {value}
</div>

      <button
        onClick={onInc}
        className="px-4 py-2 text-lg font-bold"
        style={{ color: "var(--chai-brown)" }}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  )
}