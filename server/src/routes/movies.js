import { Router } from 'express'
import { pool } from '../config/database.js'
import { requireAdmin, requireAuth } from '../middleware/auth.js'
import { AppError, asyncHandler } from '../middleware/errors.js'
import { logger } from '../services/logger.js'

const router = Router()

const movieSelect = `
  SELECT m.id, m.title, m.director, m.release_year AS releaseYear,
    m.genre, m.duration_minutes AS durationMinutes, m.synopsis,
    m.poster_path AS posterPath, m.created_at AS createdAt,
    COALESCE(ROUND(AVG(r.rating), 1), 0) AS averageRating,
    COUNT(r.id) AS reviewCount
  FROM movies m
  LEFT JOIN reviews r ON r.movie_id = m.id
`

const parseMovie = (body) => {
  const movie = {
    title: String(body.title || '').trim(),
    director: String(body.director || '').trim(),
    releaseYear: Number(body.releaseYear),
    genre: String(body.genre || '').trim(),
    durationMinutes: Number(body.durationMinutes),
    synopsis: String(body.synopsis || '').trim(),
    posterPath: String(body.posterPath || '').trim(),
  }
  if (!movie.title || !movie.director || !movie.genre || !movie.synopsis
    || !Number.isInteger(movie.releaseYear) || !Number.isInteger(movie.durationMinutes)) {
    throw new AppError(400, 'INVALID_MOVIE', 'All movie fields are required')
  }
  return movie
}

router.get('/', asyncHandler(async (request, response) => {
  const page = Math.max(1, Number(request.query.page) || 1)
  const limit = Math.min(24, Math.max(1, Number(request.query.limit) || 8))
  const offset = (page - 1) * limit
  const search = String(request.query.search || '').trim()
  const where = search ? 'WHERE m.title LIKE ? OR m.director LIKE ? OR m.genre LIKE ?' : ''
  const params = search ? Array(3).fill(`%${search}%`) : []

  const [rows] = await pool.execute(
    `${movieSelect} ${where} GROUP BY m.id ORDER BY m.created_at DESC LIMIT ? OFFSET ?`,
    [...params, limit, offset],
  )
  const [countRows] = await pool.execute(
    `SELECT COUNT(*) AS total FROM movies m ${where}`,
    params,
  )
  const total = Number(countRows[0].total)
  response.json({ items: rows, page, total, hasMore: offset + rows.length < total })
}))

router.get('/:id', asyncHandler(async (request, response) => {
  const [rows] = await pool.execute(
    `${movieSelect} WHERE m.id = ? GROUP BY m.id`,
    [request.params.id],
  )
  if (!rows[0]) {
    throw new AppError(404, 'MOVIE_NOT_FOUND', 'Movie not found')
  }
  response.json({ movie: rows[0] })
}))

router.post('/', requireAuth, requireAdmin, asyncHandler(async (request, response) => {
  const movie = parseMovie(request.body)
  const [result] = await pool.execute(
    `INSERT INTO movies
      (title, director, release_year, genre, duration_minutes, synopsis, poster_path)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [movie.title, movie.director, movie.releaseYear, movie.genre,
      movie.durationMinutes, movie.synopsis, movie.posterPath],
  )
  logger.info('Movie created', { movieId: result.insertId, userId: request.user.id })
  response.status(201).json({ movie: { id: result.insertId, ...movie, averageRating: 0, reviewCount: 0 } })
}))

router.put('/:id', requireAuth, requireAdmin, asyncHandler(async (request, response) => {
  const movie = parseMovie(request.body)
  const [result] = await pool.execute(
    `UPDATE movies SET title = ?, director = ?, release_year = ?, genre = ?,
      duration_minutes = ?, synopsis = ?, poster_path = ? WHERE id = ?`,
    [movie.title, movie.director, movie.releaseYear, movie.genre,
      movie.durationMinutes, movie.synopsis, movie.posterPath, request.params.id],
  )
  if (!result.affectedRows) {
    throw new AppError(404, 'MOVIE_NOT_FOUND', 'Movie not found')
  }
  logger.info('Movie updated', { movieId: request.params.id, userId: request.user.id })
  response.json({ movie: { id: Number(request.params.id), ...movie } })
}))

router.delete('/:id', requireAuth, requireAdmin, asyncHandler(async (request, response) => {
  const [result] = await pool.execute('DELETE FROM movies WHERE id = ?', [request.params.id])
  if (!result.affectedRows) {
    throw new AppError(404, 'MOVIE_NOT_FOUND', 'Movie not found')
  }
  logger.info('Movie deleted', { movieId: request.params.id, userId: request.user.id })
  response.status(204).end()
}))

export default router
