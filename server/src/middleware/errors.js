import { logger } from '../services/logger.js'

export class AppError extends Error {
  constructor(status, code, message) {
    super(message)
    this.status = status
    this.code = code
  }
}

export const notFound = (request, response) => {
  response.status(404).json({ code: 'NOT_FOUND', message: 'Resource not found' })
}

export const errorHandler = (error, request, response, next) => {
  if (response.headersSent) {
    return next(error)
  }
  const status = error.status || 500
  logger.error('Request failed', {
    method: request.method,
    path: request.originalUrl,
    status,
    message: error.message,
  })
  response.status(status).json({
    code: error.code || 'INTERNAL_ERROR',
    message: status === 500 ? 'Internal server error' : error.message,
  })
}

export const asyncHandler = (handler) => (request, response, next) => {
  Promise.resolve(handler(request, response, next)).catch(next)
}
