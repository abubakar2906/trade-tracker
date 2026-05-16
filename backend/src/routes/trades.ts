import { Router, Response } from 'express'
import { authenticate, AuthRequest } from '../middleware/auth.js'
import prisma from '../db/client.js'

const router = Router()
router.use(authenticate)

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const trades = await prisma.trade.findMany({
      where: { userId: req.userId },
      orderBy: { date: 'desc' },
    })
    res.json(trades)
  } catch (err) {
    console.error('Get trades error:', err)
    res.status(500).json({ error: 'Something went wrong' })
  }
})

router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const {
      symbol, bias, date, entryPoint, tradeDuration, riskReward,
      profitLoss, winLoss, comment, timeframes = [], setups = [], emotions = []
    } = req.body

    const trade = await prisma.trade.create({
      data: {
        userId: req.userId!,
        symbol,
        bias,
        date: date ? new Date(date) : new Date(),
        entryPoint,
        tradeDuration,
        riskReward,
        profitLoss,
        winLoss,
        comment,
        timeframes,
        setups,
        emotions
      },
    })
    res.status(201).json(trade)
  } catch (err) {
    console.error('Create trade error:', err)
    res.status(500).json({ error: 'Create trade error' })
  }
})

router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id)

    const existing = await prisma.trade.findFirst({ where: { id, userId: req.userId } })
    if (!existing) {
      res.status(404).json({ error: 'Trade not found' })
      return
    }

    const {
      symbol, bias, date, entryPoint, tradeDuration, riskReward,
      profitLoss, winLoss, comment, timeframes, setups, emotions
    } = req.body

    const trade = await prisma.trade.update({
      where: { id },
      data: {
        symbol, bias,
        date: date ? new Date(date) : undefined,
        entryPoint, tradeDuration, riskReward,
        profitLoss, winLoss, comment,
        timeframes, setups, emotions
      },
    })
    res.json(trade)
  } catch (err) {
    console.error('Update trade error:', err)
    res.status(500).json({ error: 'Something went wrong' })
  }
})

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id)

    // Verify ownership before deleting
    const existing = await prisma.trade.findFirst({ where: { id, userId: req.userId } })
    if (!existing) {
      res.status(404).json({ error: 'Trade not found' })
      return
    }

    await prisma.trade.delete({ where: { id } })
    res.json({ message: 'Trade deleted' })
  } catch (err) {
    console.error('Delete trade error:', err)
    res.status(500).json({ error: 'Something went wrong' })
  }
})

export default router