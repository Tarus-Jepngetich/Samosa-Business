export default function StripeButton({ disabled, onClick, children }) {
  const handleClick = (e) => {
    e.preventDefault(); // prevents form submission
    if (!disabled && onClick) {
      onClick();
    }
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={handleClick}
      className="w-full rounded-2xl px-5 py-3 font-semibold transition active:scale-[0.99]"
      style={{
        background: disabled ? "rgba(11,11,12,0.25)" : "var(--ink)",
        color: "white",
        border: "1px solid rgba(255,255,255,0.12)",
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      <span className="flex items-center justify-center gap-2">
        {/* Lock icon */}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M7 11V8a5 5 0 0 1 10 0v3"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M6 11h12a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>

        {children}
      </span>

      <span
        className="mt-1 block text-[11px] font-medium"
        style={{ opacity: 0.8 }}
      >
        Powered by Stripe
      </span>
    </button>
  );
}