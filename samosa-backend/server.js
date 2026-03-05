const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
require("dotenv").config()
const ordersRoutes = require("./routes/orders")
const stripeWebhookRoutes = require("./routes/stripeWebhook")


console.log("ENV loaded STRIPE key?", process.env.STRIPE_SECRET_KEY ? "YES" : "NO")
console.log("ENV loaded CLIENT_URL:", process.env.CLIENT_URL)

const paymentRoutes = require("./routes/payment")

const seedAdmin = require("./models/seedAdmin")

mongoose.connection.once("open", async () => {
  await seedAdmin()
})

const app = express()

app.use(cors())
app.use(express.json())
app.use("/api/admin", require("./routes/adminAuth"))
app.use("/api/payment", paymentRoutes)
app.use("/api/orders", ordersRoutes)
app.use("/api/webhook", stripeWebhookRoutes) // BEFORE express.json()
app.use(express.json())
const PORT = process.env.PORT || 5000

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)

    console.log("MongoDB connected ✅")

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })

  } catch (error) {
    console.error("MongoDB connection error:", error.message)
  }
}

startServer()