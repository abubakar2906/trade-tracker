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
    if (user && user.isVerified) {
      res.status(400).json({ error: 'Email already in use' })
      return
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const otpExpiresAt = new Date(Date.now() + 10 * 60000) // 10 mins expiry
    const hashed = await bcrypt.hash(password, 10)

    if (user) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { password: hashed, fullName, otp, otpExpiresAt }
      })
    } else {
      user = await prisma.user.create({
        data: { email, password: hashed, fullName, otp, otpExpiresAt },
      })
    }

    // Dev mode only — never log OTPs in production
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[DEV] OTP for ${email}: ${otp}`)
    }
    
    // Attempt to send email
    try {
      await sendOtpEmail(email, otp)
    } catch (emailErr) {
      console.error('Email sending failed:', emailErr)
      // We still return 200 so the user can use the console logged OTP in dev
    }

    res.status(200).json({ message: 'OTP sent to email. Please verify.' })
  } catch (err) {
    console.error('Signup error:', err)
    res.status(500).json({ error: 'Something went wrong' })
  }
})

router.post('/verify-otp', validate(verifyOtpSchema), async (req: Request, res: Response) => {
  const { email, otp } = req.body
  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      res.status(400).json({ error: 'User not found' })
      return
    }
    if (user.isVerified) {
      res.status(400).json({ error: 'Email is already verified' })
      return
    }
    if (user.otp !== otp || !user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      res.status(400).json({ error: 'Invalid or expired OTP' })
      return
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true, otp: null, otpExpiresAt: null },
    })

    const token = jwt.sign({ userId: updatedUser.id }, process.env.JWT_SECRET!, { expiresIn: '7d' })
    res.status(200).json({ token, user: { id: updatedUser.id, email: updatedUser.email, fullName: updatedUser.fullName } })
  } catch (err) {
    console.error('Verify OTP error:', err)
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
    if (!user.isVerified) {
      res.status(400).json({ error: 'Please verify your email first', requiresVerification: true })
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