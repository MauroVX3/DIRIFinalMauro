import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { pool } from '../src/config/database.js'

const email = process.env.ADMIN_EMAIL?.trim().toLowerCase()
const password = process.env.ADMIN_PASSWORD
const name = process.env.ADMIN_NAME?.trim() || 'Administrador'

if (!email || !password || password.length < 6) {
  throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD of at least 6 characters are required')
}

const passwordHash = await bcrypt.hash(password, 12)
await pool.execute(
  `INSERT INTO users (name, email, password_hash, role)
   VALUES (?, ?, ?, 'ADMIN')
   ON DUPLICATE KEY UPDATE name = VALUES(name), password_hash = VALUES(password_hash), role = 'ADMIN'`,
  [name, email, passwordHash],
)
console.log(`Administrator configured: ${email}`)
await pool.end()
