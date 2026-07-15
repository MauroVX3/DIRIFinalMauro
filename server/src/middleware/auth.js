import jwt from 'jsonwebtoken'
import { pool } from '../config/database.js'
import { AppError, asyncHandler } from './errors.js'

export const requireAuth = asyncHandler(async (request, response, next) => {
  const authorization = request.headers.authorization
  if (!authorization?.startsWith('Bearer ')) {
    throw new AppError(401, 'AUTH_REQUIRED', 'Authentication required')
  }

  let payload
  try {
    payload = jwt.verify(authorization.slice(7), process.env.JWT_SECRET)
  } catch {
    throw new AppError(401, 'INVALID_TOKEN', 'Invalid or expired token')
  }

  const [rows] = await pool.execute(
    'SELECT id, name, email, role FROM users WHERE id = ?',
    [payload.sub],
  )
  if (!rows[0]) {
    throw new AppError(401, 'INVALID_TOKEN', 'User no longer exists')
  }
  request.user = rows[0]
  next()
})

export const requireAdmin = (request, response, next) => {
  if (request.user?.role !== 'ADMIN') {
    return next(new AppError(403, 'ADMIN_REQUIRED', 'Administrator role required'))
  }
  next()
}
