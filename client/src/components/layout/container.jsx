export default function container({ children }) {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
      {children}
    </div>
  )
}