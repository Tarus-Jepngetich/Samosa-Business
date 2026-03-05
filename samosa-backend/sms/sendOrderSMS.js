const twilio = require("twilio")

function normalizeAU(phone) {
  // Very simple AU normalizer:
  // "04xx..." -> "+614xx..."
  // If already +, keep it.
  const p = String(phone || "").trim()
  if (!p) return null
  if (p.startsWith("+")) return p
  if (p.startsWith("04")) return "+61" + p.slice(1)
  return p // fallback (you can improve later)
}

async function sendOrderSMS(order) {
  if (!process.env.TWILIO_ACCOUNT_SID) return
  if (!process.env.TWILIO_AUTH_TOKEN) return
  if (!process.env.TWILIO_FROM_NUMBER) return

  const to = normalizeAU(order.customer?.phone)
  if (!to) return

  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

  const pickupAddress = "2A Franke Ct Kingston 4114"
  const msg =
    `✅ Samosa order confirmed!\n` +
    `Pickup: Saturday afternoon\n` +
    `Address: ${pickupAddress}\n` +
    `Please bring identification.\n` +
    `Thanks for your order! 🥟`

  await client.messages.create({
    from: process.env.TWILIO_FROM_NUMBER,
    to,
    body: msg,
  })
}

module.exports = { sendOrderSMS }