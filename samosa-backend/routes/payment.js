const express = require("express")
const router = express.Router()
const Stripe = require("stripe")
const Order = require("../models/Order")
const orderWindow = require("../middleware/orderWindow")

router.post("/create-checkout-session", orderWindow, async (req, res) => {
  try {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) {
      return res.status(500).json({ error: "STRIPE_SECRET_KEY missing" })
    }

    const stripe = Stripe(key)
    const { customer, items } = req.body

    if (!customer?.name || !customer?.phone) {
      return res.status(400).json({ error: "Customer name and phone are required." })
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Items are required." })
    }

    // Normalize + validate backend-side
    const normalizedItems = items.map((it) => {
      const unitPriceCents = Number(it.unitPriceCents)
      const quantity = Number(it.quantity)
      const packSize = Number(it.packSize || 6)

      if (!Number.isFinite(unitPriceCents) || unitPriceCents <= 0) {
        throw new Error(`Invalid unitPriceCents for item: ${it?.name || "unknown"}`)
      }

      if (!Number.isFinite(quantity) || quantity <= 0) {
        throw new Error(`Invalid quantity for item: ${it?.name || "unknown"}`)
      }

      const lineTotalCents = unitPriceCents * quantity

      return {
        productId: it.productId || "",
        name: it.name || "Samosa Pack",
        unitPriceCents,
        quantity,
        packSize,
        lineTotalCents,
      }
    })

    const totalCents = normalizedItems.reduce((sum, it) => sum + it.lineTotalCents, 0)

    // Create order first
    const order = await Order.create({
      customer: {
        name: customer.name.trim(),
        phone: customer.phone.trim(),
        pepper: customer.pepper || "mild",
        notes: customer.notes || "",
      },
      items: normalizedItems,
      totalCents,
      status: "pending",
      pickedUp: false,
      stripe: {},
    })

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: normalizedItems.map((it) => ({
        price_data: {
          currency: "aud",
          product_data: {
            name: it.name,
          },
          unit_amount: it.unitPriceCents,
        },
        quantity: it.quantity,
      })),
      metadata: {
        orderId: String(order._id),
      },
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/order`,
    })

    // Save session id immediately for success-page lookup
    order.stripe.sessionId = session.id
    await order.save()

    return res.json({ url: session.url })
  } catch (err) {
    console.error("create-checkout-session error:", err.message)
    return res.status(500).json({ error: err.message })
  }
})

module.exports = router