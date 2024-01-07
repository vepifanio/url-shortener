import setRateLimit from 'express-rate-limit'

const RATE_LIMIT_WINDOW_TIME_IN_MS = 60 * 1000 // 1 Minute
const RATE_LIMIT_MAX_REQUESTS = 5

export const rateLimitMidlleware = setRateLimit({
  windowMs: RATE_LIMIT_WINDOW_TIME_IN_MS,
  limit: RATE_LIMIT_MAX_REQUESTS,
  message: 'You have exceeded your requests limit.',
  headers: true,
})
