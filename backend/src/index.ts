import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'
import authRoutes from './routes/auth.js'
import tradeRoutes from './routes/trades.js'
import strategyRoutes from './routes/strategies.js'
import profileRoutes from './routes/profile.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://trade-tracker-wheat.vercel.app',
    'https://trade-tracker-1yxm.vercel.app',
  ],
  credentials: true
}))
app.use(express.json())

// Rate limit auth endpoints: max 15 requests per 15 minutes per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
})

app.use('/api/auth', authLimiter, authRoutes)
app.use('/api/trades', tradeRoutes)
app.use('/api/strategies', strategyRoutes)
app.use('/api/profile', profileRoutes)

app.get('/health', (_, res) => res.json({ status: 'ok' }))

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})