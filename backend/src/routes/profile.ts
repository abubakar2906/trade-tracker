import { Router, Response } from 'express'
import { authenticate, AuthRequest } from '../middleware/auth.js'
import prisma from '../db/client.js'

const router = Router()
router.use(authenticate)

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, email: true, fullName: true, phone: true, location: true, bio: true, tradingStyle: true, preferredMarkets: true },
    })
    res.json(user)
  } catch {
    res.status(500).json({ error: 'Something went wrong' })
  }
})

router.put('/', async (req: AuthRequest, res: Response) => {
  const { fullName, phone, location, bio, tradingStyle, preferredMarkets } = req.body
  try {
    const user = await prisma.user.update({
      where: { id: req.userId },
      data: { fullName, phone, location, bio, tradingStyle, preferredMarkets },
      select: { id: true, email: true, fullName: true, phone: true, location: true, bio: true, tradingStyle: true, preferredMarkets: true },
    })
    res.json(user)
  } catch {
    res.status(500).json({ error: 'Something went wrong' })
  }
})

export default router