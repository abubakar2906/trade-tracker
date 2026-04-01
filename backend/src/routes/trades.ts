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

// 1. The Manual POST (for the Web Frontend)
// Uses 'authenticate' - Requires JWT
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const {
      symbol, tradeType, action, entryPrice, exitPrice,
      quantity, amountInvested, stopLoss, takeProfit,
      emotionalState, notes, status, entryDate, exitDate,
    } = req.body

    const profitLoss = exitPrice
      ? (exitPrice - entryPrice) * quantity * (action === 'buy' ? 1 : -1)
      : null

    const trade = await prisma.trade.create({
      data: {
        userId: req.userId!,
        symbol, tradeType, entryPrice,
        exitPrice: exitPrice || null,
        quantity, amountInvested: amountInvested || null,
        stopLoss: stopLoss || null,
        takeProfit: takeProfit || null,
        profitLoss,
        status: status || 'open',
        entryDate: new Date(entryDate),
        exitDate: exitDate ? new Date(exitDate) : null,
      },
    })
    res.status(201).json(trade)
  } catch (err) {
    res.status(500).json({ error: 'Create trade error' })
  }
})

// 2. The VPS Webhook POST (for the terminals)
// NO 'authenticate' - Identified by MT5 Account ID
router.post('/webhook', async (req, res) => {
  try {
    const { account, symbol, type, volume, price, deal_id } = req.body;
    console.log("Incoming VPS Trade for Account:", account);

    // Find which user owns this MT5 account
    const brokerAccount = await prisma.brokerAccount.findFirst({
      where: { accountId: account.toString() }
    });

    if (!brokerAccount) {
      return res.status(404).json({ error: 'Broker account not found in DB' });
    }

    // Save to your Prisma Trade table
    const trade = await prisma.trade.create({
      data: {
        userId: brokerAccount.userId,
        symbol: symbol,
        tradeType: 'forex',
        entryPrice: price,
        quantity: volume,
        status: 'closed', // Webhook fires on 'deal', usually closed trades
        entryDate: new Date(),
        notes: `vps_deal_id_${deal_id}`
      }
    });

    res.status(200).json({ message: 'Trade tracked', id: trade.id });
  } catch (error) {
    console.error("Webhook Logic Error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

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