import { Router, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../db/client.js'
import { sendOtpEmail } from '../services/email.js'

const router = Router()

import { z } from 'zod'
import { validate } from '../middleware/validate.js'

const signupSchema = z.object({
  body: z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    fullName: z.string().min(1, 'Full name is required').trim(),
  }),
})

const verifyOtpSchema = z.object({
  body: z.object({
    email: z.string().email('Please enter a valid email address'),
    otp: z.string().min(6).max(6),
  }),
})

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
})

// --- routes ---
router.post('/signup', validate(signupSchema), async (req: Request, res: Response) => {
  const { email, password, fullName } = req.body
  try {
    let user = await prisma.user.findUnique({ where: { email } })
    if (user) {
      res.status(400).json({ error: 'Email already in use' })
      return
    }

    const hashed = await bcrypt.hash(password, 10)

    user = await prisma.user.create({
      data: { email, password: hashed, fullName, isVerified: true },
    })

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    )

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.status(200).json({
      message: 'Account created successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
    })
  } catch (err) {
    console.error('Signup error:', err)
    res.status(500).json({ error: 'Something went wrong' })
  }
})

router.post('/login', validate(loginSchema), async (req: Request, res: Response) => {
  const { email, password } = req.body
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
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: '7d' })

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.json({ token, user: { id: user.id, email: user.email, fullName: user.fullName } })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ error: 'Something went wrong' })
  }
})

export default router