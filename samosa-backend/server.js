const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
require("dotenv").config()

const ordersRoutes = require("./routes/orders")
const stripeWebhookRoutes = require("./routes/stripeWebhook")
const paymentRoutes = require("./routes/payment")
const seedAdmin = require("./models/seedAdmin")

console.log("ENV loaded STRIPE key?", process.env.STRIPE_SECRET_KEY ? "YES" : "NO")
console.log("ENV loaded CLIENT_URL:", process.env.CLIENT_URL)

const app = express()

mongoose.connection.once("open", async () => {
  await seedAdmin()
})

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
)

//  Mount Stripe webhook BEFORE express.json()
app.use("/api/webhook", stripeWebhookRoutes)

//  JSON parser for normal routes
app.use(express.json())

// Other routes
app.use("/api/admin", require("./routes/adminAuth"))
app.use("/api/payment", paymentRoutes)
app.use("/api/orders", ordersRoutes)

const PORT = process.env.PORT || 5000

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("MongoDB connected ✅")

    app.listen(PORT, () => console.log(`Server running on ${PORT}`))
  } catch (error) {
    console.error("MongoDB connection error:", error.message)
  }
}

startServer()