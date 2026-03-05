const express = require("express")
const Stripe = require("stripe")
const Order = require("../models/Order")

const router = express.Router()

// Stripe requires raw body for signature verification
router.post("/", express.raw({ type: "application/json" }), async (req, res) => {
  try {
    const stripe = Stripe(process.env.STRIPE_SECRET_KEY)
    const sig = req.headers["stripe-signature"]

    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET
    if (!endpointSecret) {
      return res.status(500).send("Missing STRIPE_WEBHOOK_SECRET")
    }

    const event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret)

    if (event.type === "checkout.session.completed") {
      const session = event.data.object
      const orderId = session.metadata?.orderId

      if (orderId) {
        await Order.findByIdAndUpdate(orderId, {
          status: "paid",
          "stripe.sessionId": session.id,
          "stripe.paymentIntentId": session.payment_intent,
        })
      }
    }

    res.json({ received: true })
  } catch (err) {
    console.error("Webhook error:", err.message)
    res.status(400).send(`Webhook Error: ${err.message}`)
  }
})

module.exports = router