import { Router, Response } from 'express'
import { authenticate, AuthRequest } from '../middleware/auth.js'
import prisma from '../db/client.js'

const router = Router()
router.use(authenticate)

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const trades = await prisma.trade.findMany({
      where: { userId: req.userId },
      orderBy: { entryDate: 'desc' },
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
      symbol, tradeType, action, entryPrice, exitPrice,
      quantity, amountInvested, stopLoss, takeProfit,
      emotionalState, notes, status, entryDate, exitDate,
    } = req.body

    const profitLoss = exitPrice
      ? (exitPrice - entryPrice) * quantity * (action === 'buy' ? 1 : -1)
      : null

    const percentageGain = profitLoss && amountInvested
      ? (profitLoss / amountInvested) * 100
      : null

    const risk = stopLoss
      ? Math.abs(entryPrice - stopLoss) * quantity
      : null

    const reward = takeProfit
      ? Math.abs(takeProfit - entryPrice) * quantity
      : null

    const riskRewardRatio = risk && reward ? reward / risk : null

    const trade = await prisma.trade.create({
      data: {
        userId: req.userId!,
        symbol,
        tradeType,
        entryPrice,
        exitPrice: exitPrice || null,
        quantity,
        amountInvested: amountInvested || null,
        stopLoss: stopLoss || null,
        takeProfit: takeProfit || null,
        profitLoss,
        percentageGain,
        riskRewardRatio,
        emotionalState: emotionalState || null,
        notes: notes || null,
        status: status || 'open',
        entryDate: new Date(entryDate),
        exitDate: exitDate ? new Date(exitDate) : null,
      },
    })
    res.status(201).json(trade)
  } catch (err) {
    console.error('Create trade error:', err)
    res.status(500).json({ error: 'Something went wrong' })
  }
})

router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id)

    // Verify ownership before updating
    const existing = await prisma.trade.findFirst({ where: { id, userId: req.userId } })
    if (!existing) {
      res.status(404).json({ error: 'Trade not found' })
      return
    }

    const {
      symbol, tradeType, action, entryPrice, exitPrice,
      quantity, amountInvested, stopLoss, takeProfit,
      emotionalState, notes, status, entryDate, exitDate,
    } = req.body

    const profitLoss = exitPrice
      ? (exitPrice - entryPrice) * quantity * (action === 'buy' ? 1 : -1)
      : null

    const percentageGain = profitLoss && amountInvested
      ? (profitLoss / amountInvested) * 100
      : null

    const risk = stopLoss
      ? Math.abs(entryPrice - stopLoss) * quantity
      : null

    const reward = takeProfit
      ? Math.abs(takeProfit - entryPrice) * quantity
      : null

    const riskRewardRatio = risk && reward ? reward / risk : null

    const trade = await prisma.trade.update({
      where: { id },
      data: {
        symbol, tradeType,
        entryPrice, exitPrice: exitPrice || null,
        quantity, amountInvested: amountInvested || null,
        stopLoss: stopLoss || null,
        takeProfit: takeProfit || null,
        profitLoss, percentageGain, riskRewardRatio,
        emotionalState: emotionalState || null,
        notes: notes || null,
        status: status || 'open',
        entryDate: new Date(entryDate),
        exitDate: exitDate ? new Date(exitDate) : null,
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