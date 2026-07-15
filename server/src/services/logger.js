const write = (level, message, details) => {
  const entry = {
    level,
    timestamp: new Date().toISOString(),
    message,
    ...(details ? { details } : {}),
  }
  console[level](JSON.stringify(entry))
}

export const logger = {
  info: (message, details) => write('info', message, details),
  warn: (message, details) => write('warn', message, details),
  error: (message, details) => write('error', message, details),
}
