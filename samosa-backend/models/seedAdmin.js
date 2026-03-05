const bcrypt = require("bcrypt")
const Admin = require("./Admin")

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD

  if (!email || !password) return

  const existing = await Admin.findOne({ email })
  if (existing) return

  const passwordHash = await bcrypt.hash(password, 12)
  await Admin.create({ email, passwordHash })
  console.log("✅ Admin seeded:", email)
}

module.exports = seedAdmin