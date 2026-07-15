import type { Middleware } from '@reduxjs/toolkit'
const safeAction = (action: unknown) => {
  if (!action || typeof action !== 'object') return action
  const record = action as { meta?: { arg?: unknown } }
  const arg = record.meta?.arg
  if (!arg || typeof arg !== 'object' || !('password' in arg)) return action
  return {
    ...record,
    meta: { ...record.meta, arg: { ...arg, password: '[REDACTED]' } },
  }
}

const loggerMiddleware: Middleware = (storeAPI) => (next) => (action) => {
  console.log('Enviando acción:', safeAction(action))
  console.log('Estado anterior:', storeAPI.getState())
  const result = next(action)
  console.log('Nuevo estado:', storeAPI.getState())
  return result
}

export default loggerMiddleware
