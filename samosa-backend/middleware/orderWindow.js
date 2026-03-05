const { DateTime } = require("luxon")

module.exports = function orderWindow(req, res, next) {
  // Brisbane time
  const now = DateTime.now().setZone("Australia/Brisbane")

  // Friday = 5 (Luxon: Monday=1 ... Sunday=7)
  const isFriday = now.weekday === 5
  const cutoff = now.set({ hour: 14, minute: 0, second: 0, millisecond: 0 })

  // After Friday 2pm => CLOSED
  if (isFriday && now > cutoff) {
    return res.status(403).json({
      error: "Orders are closed. Orders close Friday at 2:00 PM.",
    })
  }

  // Optional: also close Saturday+Sunday or any other rule if you want later
  next()
}