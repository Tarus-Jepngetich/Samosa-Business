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

    console.log("Webhook received:", event.type)

    if (event.type === "checkout.session.completed") {
      const session = event.data.object
      const orderId = session.metadata?.orderId

      console.log(" Session ID:", session.id)
      console.log(" Order ID from metadata:", orderId)

      if (!orderId) {
        console.log(" No orderId found in session metadata")
        return res.json({ received: true, warning: "No orderId in metadata" })
      }

      const order = await Order.findById(orderId)

      if (!order) {
        console.log(" Order not found for orderId:", orderId)
        return res.json({ received: true, warning: "Order not found" })
      }

      // Avoid reprocessing duplicate webhook deliveries
      if (order.status === "paid") {
        console.log(" Order already marked as paid:", order._id)
        return res.json({ received: true, message: "Order already processed" })
      }

      order.status = "paid"
      order.stripe = order.stripe || {}
      order.stripe.sessionId = session.id
      order.stripe.paymentIntentId = session.payment_intent || ""

      await order.save()
      console.log(" Order marked as paid:", order._id)

      // SMS should never block payment confirmation
      try {
        await sendOrderSMS(order)
        console.log(" SMS sent for order:", order._id)
      } catch (smsErr) {
        console.error(" SMS send failed:", smsErr.message)
      }
    }

    return res.json({ received: true })
  } catch (err) {
    console.error(" Webhook error:", err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }
})

module.exports = router