import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { pool } from './config/database.js'
import authRoutes from './routes/auth.js'
import movieRoutes from './routes/movies.js'
import reviewRoutes from './routes/reviews.js'
import { errorHandler, notFound } from './middleware/errors.js'
import { logger } from './services/logger.js'

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is required')
}

const app = express()
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }))
app.use(express.json({ limit: '1mb' }))
app.use((request, response, next) => {
  const startedAt = Date.now()
  response.on('finish', () => {
    logger.info('HTTP request', {
      method: request.method,
      path: request.originalUrl,
      status: response.statusCode,
      durationMs: Date.now() - startedAt,
    })
  })
  next()
})

app.get('/api/health', async (request, response, next) => {
  try {
    await pool.query('SELECT 1')
    response.json({ status: 'ok' })
  } catch (error) {
    next(error)
  }
})
app.use('/api/auth', authRoutes)
app.use('/api/movies', movieRoutes)
app.use('/api/reviews', reviewRoutes)
app.use(notFound)
app.use(errorHandler)

const port = Number(process.env.PORT || 3001)
app.listen(port, () => logger.info(`Server listening on port ${port}`))
