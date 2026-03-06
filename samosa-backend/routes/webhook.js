module.exports = router
const express = require("express")
const Stripe = require("stripe")
const Order = require("../models/Order")
const { sendOrderSMS } = require("../sms/sendOrderSMS")

const router = express.Router()

router.post("/stripe", express.raw({ type: "application/json" }), async (req, res) => {
  const stripe = Stripe(process.env.STRIPE_SECRET_KEY)

  try {
    const sig = req.headers["stripe-signature"]

    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )

    if (event.type === "checkout.session.completed") {
      const session = event.data.object
      const orderId = session.metadata?.orderId

      if (orderId) {
        const order = await Order.findById(orderId)

        if (order) {
          order.status = "paid"
          order.stripe = order.stripe || {}
          order.stripe.sessionId = session.id
          order.stripe.paymentIntent = session.payment_intent || null

          await order.save()
          await sendOrderSMS(order)
        }
      }
    }

    return res.json({ received: true })
  } catch (err) {
    console.error("Webhook error:", err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }
})

module.exports = router