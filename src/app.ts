import express from 'express'
import { router } from './routes'
import { rateLimitMidlleware } from './middlewares/routeLimiter'

const app = express()

app.use(express.json())
app.use(rateLimitMidlleware)
app.use(router)

export { app }
