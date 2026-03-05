const express = require("express")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const Admin = require("../models/Admin")

const router = express.Router()

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ message: "Email and password required" })

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() })
    if (!admin) return res.status(401).json({ message: "Invalid credentials" })

    const ok = await bcrypt.compare(password, admin.passwordHash)
    if (!ok) return res.status(401).json({ message: "Invalid credentials" })

    const token = jwt.sign(
      { sub: admin._id.toString(), role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    res.json({ token })
  } catch (e) {
    res.status(500).json({ message: "Server error" })
  }
})

router.get("/me", async (req, res) => {
  // optional: used by frontend to validate token quickly
  const auth = req.headers.authorization || ""
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null
  if (!token) return res.status(401).json({ message: "Missing token" })

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    res.json({ ok: true, role: payload.role })
  } catch {
    res.status(401).json({ message: "Invalid token" })
  }
})

module.exports = router