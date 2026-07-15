import { Router } from 'express'
import { pool } from '../config/database.js'
import { requireAuth } from '../middleware/auth.js'
import { AppError, asyncHandler } from '../middleware/errors.js'
import { logger } from '../services/logger.js'

const router = Router()

const reviewSelect = `
  SELECT r.id, r.movie_id AS movieId, r.user_id AS userId, r.rating,
    r.title, r.content, r.created_at AS createdAt, r.updated_at AS updatedAt,
    u.name AS userName, m.title AS movieTitle, m.poster_path AS posterPath
  FROM reviews r
  JOIN users u ON u.id = r.user_id
  JOIN movies m ON m.id = r.movie_id
`

const parseReview = (body) => {
  const review = {
    rating: Number(body.rating),
    title: String(body.title || '').trim(),
    content: String(body.content || '').trim(),
  }
  if (!Number.isInteger(review.rating) || review.rating < 1 || review.rating > 5
    || !review.title || !review.content) {
    throw new AppError(400, 'INVALID_REVIEW', 'Rating, title and review content are required')
  }
  return review
}

router.get('/', asyncHandler(async (request, response) => {
  const page = Math.max(1, Number(request.query.page) || 1)
  const limit = Math.min(30, Math.max(1, Number(request.query.limit) || 10))
  const offset = (page - 1) * limit
  const search = String(request.query.search || '').trim()
  const where = search ? 'WHERE r.title LIKE ? OR r.content LIKE ? OR m.title LIKE ?' : ''
  const params = search ? Array(3).fill(`%${search}%`) : []
  const [rows] = await pool.execute(
    `${reviewSelect} ${where} ORDER BY r.updated_at DESC LIMIT ? OFFSET ?`,
    [...params, limit, offset],
  )
  const [countRows] = await pool.execute(
    `SELECT COUNT(*) AS total FROM reviews r JOIN movies m ON m.id = r.movie_id ${where}`,
    params,
  )
  const total = Number(countRows[0].total)
  response.json({ items: rows, page, total, hasMore: offset + rows.length < total })
}))

router.get('/mine', requireAuth, asyncHandler(async (request, response) => {
  const [rows] = await pool.execute(
    `${reviewSelect} WHERE r.user_id = ? ORDER BY r.updated_at DESC`,
    [request.user.id],
  )
  response.json({ items: rows })
}))

router.get('/movie/:movieId', asyncHandler(async (request, response) => {
  const [rows] = await pool.execute(
    `${reviewSelect} WHERE r.movie_id = ? ORDER BY r.updated_at DESC`,
    [request.params.movieId],
  )
  response.json({ items: rows })
}))

router.post('/movie/:movieId', requireAuth, asyncHandler(async (request, response) => {
  const review = parseReview(request.body)
  const [result] = await pool.execute(
    'INSERT INTO reviews (movie_id, user_id, rating, title, content) VALUES (?, ?, ?, ?, ?)',
    [request.params.movieId, request.user.id, review.rating, review.title, review.content],
  )
  logger.info('Review created', { reviewId: result.insertId, userId: request.user.id })
  response.status(201).json({ review: {
    id: result.insertId,
    movieId: Number(request.params.movieId),
    userId: request.user.id,
    userName: request.user.name,
    ...review,
  } })
}))

router.put('/:id', requireAuth, asyncHandler(async (request, response) => {
  const review = parseReview(request.body)
  const [result] = await pool.execute(
    'UPDATE reviews SET rating = ?, title = ?, content = ? WHERE id = ? AND user_id = ?',
    [review.rating, review.title, review.content, request.params.id, request.user.id],
  )
  if (!result.affectedRows) {
    throw new AppError(404, 'REVIEW_NOT_FOUND', 'Review not found or does not belong to you')
  }
  logger.info('Review updated', { reviewId: request.params.id, userId: request.user.id })
  response.json({ review: { id: Number(request.params.id), userId: request.user.id, ...review } })
}))

router.delete('/:id', requireAuth, asyncHandler(async (request, response) => {
  const [result] = await pool.execute(
    'DELETE FROM reviews WHERE id = ? AND user_id = ?',
    [request.params.id, request.user.id],
  )
  if (!result.affectedRows) {
    throw new AppError(404, 'REVIEW_NOT_FOUND', 'Review not found or does not belong to you')
  }
  logger.info('Review deleted', { reviewId: request.params.id, userId: request.user.id })
  response.status(204).end()
}))

export default router
