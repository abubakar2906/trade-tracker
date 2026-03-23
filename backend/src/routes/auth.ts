import { Router, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../db/client.js'

const router = Router()

// --- helpers ---
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateSignup(email: string, password: string, fullName: string) {
  if (!fullName || fullName.trim().length < 1) return 'Full name is required'
  if (!EMAIL_RE.test(email)) return 'Please enter a valid email address'
  if (!password || password.length < 8) return 'Password must be at least 8 characters'
  return null
}

function validateLogin(email: string, password: string) {
  if (!EMAIL_RE.test(email)) return 'Please enter a valid email address'
  if (!password || password.length < 1) return 'Password is required'
  return null
}

// --- routes ---
router.post('/signup', async (req: Request, res: Response) => {
  const { email, password, fullName } = req.body
  const validationError = validateSignup(email, password, fullName)
  if (validationError) {
    res.status(400).json({ error: validationError })
    return
  }
  try {
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      res.status(400).json({ error: 'Email already in use' })
      return
    }
    const hashed = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { email, password: hashed, fullName },
    })
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' })
    res.status(201).json({ token, user: { id: user.id, email: user.email, fullName: user.fullName } })
  } catch (err) {
    console.error('Signup error:', err)
    res.status(500).json({ error: 'Something went wrong' })
  }
})

router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body
  const validationError = validateLogin(email, password)
  if (validationError) {
    res.status(400).json({ error: validationError })
    return
  }
  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      res.status(400).json({ error: 'Invalid credentials' })
      return
    }
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      res.status(400).json({ error: 'Invalid credentials' })
      return
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' })
    res.json({ token, user: { id: user.id, email: user.email, fullName: user.fullName } })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ error: 'Something went wrong' })
  }
})

export default router