import { Router, Response } from 'express'
import { authenticate, AuthRequest } from '../middleware/auth.js'
import prisma from '../db/client.js'
import { generateInsights, chatWithCoach, getTradeCount, MIN_TRADES_FOR_INSIGHTS } from '../services/ai.js'
import { logger } from '../utils/logger.js'

const router = Router()
router.use(authenticate)

// ── GET /api/ai/insights — Fetch stored insights ────────────────────────────────

router.get('/insights', async (req: AuthRequest, res: Response) => {
  try {
    const insights = await prisma.aIInsight.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
    })
    res.json(insights)
  } catch (err) {
    logger.error(err, 'Failed to fetch insights')
    res.status(500).json({ error: 'Failed to fetch insights' })
  }
})

// ── GET /api/ai/data — Single endpoint: insights + status in one DB round-trip ──

router.get('/data', async (req: AuthRequest, res: Response) => {
  try {
    // Run sequentially to prevent connection pool timeouts on cold start
    const tradeCount = await prisma.trade.count({ where: { userId: req.userId } })
    const insights = await prisma.aIInsight.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
    })

    res.json({
      insights,
      status: {
        ready: tradeCount >= MIN_TRADES_FOR_INSIGHTS,
        tradeCount,
        required: MIN_TRADES_FOR_INSIGHTS,
        lastGenerated: insights[0]?.createdAt || null,
      },
    })
  } catch (err) {
    logger.error(err, 'Failed to fetch AI data')
    res.status(500).json({ error: 'Failed to fetch AI data' })
  }
})

// ── POST /api/ai/insights/generate — Trigger new insight generation ─────────────

router.post('/insights/generate', async (req: AuthRequest, res: Response) => {
  try {
    const tradeCount = await getTradeCount(req.userId!)

    if (tradeCount < MIN_TRADES_FOR_INSIGHTS) {
      res.status(400).json({
        error: `Need at least ${MIN_TRADES_FOR_INSIGHTS} trades for AI analysis. You have ${tradeCount}.`,
        tradeCount,
        required: MIN_TRADES_FOR_INSIGHTS,
      })
      return
    }

    const insights = await generateInsights(req.userId!)
    res.json({ message: `Generated ${insights.length} insights.`, insights })
  } catch (err: any) {
    logger.error(err, 'Insight generation failed')
    res.status(500).json({ error: err.message || 'Insight generation failed' })
  }
})

// ── POST /api/ai/chat — Conversational chat with the trading coach ──────────────

router.post('/chat', async (req: AuthRequest, res: Response) => {
  try {
    const { message, history = [] } = req.body

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' })
      return
    }

    const tradeCount = await getTradeCount(req.userId!)
    if (tradeCount < MIN_TRADES_FOR_INSIGHTS) {
      res.status(400).json({
        error: `Need at least ${MIN_TRADES_FOR_INSIGHTS} trades before using AI chat. You have ${tradeCount}.`,
      })
      return
    }

    const reply = await chatWithCoach(req.userId!, message, history)
    res.json({ reply })
  } catch (err: any) {
    logger.error(err, 'AI chat failed')
    res.status(500).json({ error: err.message || 'AI chat failed' })
  }
})

// ── GET /api/ai/status — Check if the user has enough trades for AI ─────────────

router.get('/status', async (req: AuthRequest, res: Response) => {
  try {
    const tradeCount = await getTradeCount(req.userId!)
    const insights = await prisma.aIInsight.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
      take: 1,
      select: { createdAt: true },
    })

    res.json({
      ready: tradeCount >= MIN_TRADES_FOR_INSIGHTS,
      tradeCount,
      required: MIN_TRADES_FOR_INSIGHTS,
      lastGenerated: insights[0]?.createdAt || null,
    })
  } catch (err) {
    logger.error(err, 'Failed to check AI status')
    res.status(500).json({ error: 'Failed to check AI status' })
  }
})


export default router
