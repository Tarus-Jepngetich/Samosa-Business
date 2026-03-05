const express = require("express")
const router = express.Router()
const Order = require("../models/Order")
const requireAdmin = require("../middleware/requireAdmin") // ✅ JWT middleware ONLY

// GET /api/orders?status=paid&pickedUp=false
router.get("/", requireAdmin, async (req, res) => {
  try {
    const { status, pickedUp } = req.query

    const filter = {}
    if (status) filter.status = status
    if (pickedUp === "true") filter.pickedUp = true
    if (pickedUp === "false") filter.pickedUp = false

    const orders = await Order.find(filter).sort({ createdAt: -1 }).lean()
    return res.json({ orders })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
})

// PATCH /api/orders/:id/picked-up
router.patch("/:id/picked-up", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const { pickedUp } = req.body

    const order = await Order.findByIdAndUpdate(
      id,
      {
        pickedUp: !!pickedUp,
        pickedUpAt: pickedUp ? new Date() : null,
      },
      { new: true }
    ).lean()

    if (!order) return res.status(404).json({ error: "Order not found" })

    return res.json({ order })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
})

module.exports = router