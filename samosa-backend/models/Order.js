const mongoose = require("mongoose")

const OrderSchema = new mongoose.Schema(
  {
    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      pepper: { type: String, enum: ["no_pepper", "mild", "hot"], default: "mild" },
      notes: { type: String, default: "" },
    },

    items: [
      {
        productId: { type: String, default: "" },
        name: { type: String, required: true },
        unitPriceCents: { type: Number, required: true },
        quantity: { type: Number, required: true }, // packs
        packSize: { type: Number, default: 6 },
        lineTotalCents: { type: Number, required: true },
      },
    ],

    totalCents: { type: Number, required: true },

    status: {
      type: String,
      enum: ["pending", "paid", "cancelled"],
      default: "pending",
    },

    // Admin pickup tracking
    pickedUp: { type: Boolean, default: false },
    pickedUpAt: { type: Date, default: null },

    // Stripe references
    stripe: {
      sessionId: { type: String, default: "" },
      paymentIntentId: { type: String, default: "" },
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Order", OrderSchema)