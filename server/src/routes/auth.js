import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { pool } from '../config/database.js'
import { requireAuth } from '../middleware/auth.js'
import { AppError, asyncHandler } from '../middleware/errors.js'
import { logger } from '../services/logger.js'

const router = Router()

const createToken = (user) => jwt.sign(
  { sub: user.id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '8h' },
)

router.post('/register', asyncHandler(async (request, response) => {
  const { name, email, password } = request.body
  if (!name?.trim() || !email?.trim() || typeof password !== 'string' || password.length < 6) {
    throw new AppError(400, 'INVALID_FORM', 'Name, email and a password of at least 6 characters are required')
  }

  const normalizedEmail = email.trim().toLowerCase()
  const [existing] = await pool.execute('SELECT id FROM users WHERE email = ?', [normalizedEmail])
  if (existing.length) {
    throw new AppError(409, 'EMAIL_EXISTS', 'Email is already registered')
  }

  const passwordHash = await bcrypt.hash(password, 12)
  const [result] = await pool.execute(
    'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
    [name.trim(), normalizedEmail, passwordHash, 'USER'],
  )
  const user = { id: result.insertId, name: name.trim(), email: normalizedEmail, role: 'USER' }
  logger.info('User registered', { userId: user.id })
  response.status(201).json({ user, token: createToken(user) })
}))

router.post('/login', asyncHandler(async (request, response) => {
  const { email, password } = request.body
  const [rows] = await pool.execute(
    'SELECT id, name, email, password_hash, role FROM users WHERE email = ?',
    [String(email || '').trim().toLowerCase()],
  )
  const record = rows[0]
  if (!record || !(await bcrypt.compare(String(password || ''), record.password_hash))) {
    throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid credentials')
  }
  const user = { id: record.id, name: record.name, email: record.email, role: record.role }
  logger.info('User logged in', { userId: user.id })
  response.json({ user, token: createToken(user) })
}))

router.get('/me', requireAuth, (request, response) => {
  response.json({ user: request.user })
})

export default router
