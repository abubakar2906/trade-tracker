import { Router, Response } from 'express'
import { authenticate, AuthRequest } from '../middleware/auth.js'
import prisma from '../db/client.js'

const router = Router()
router.use(authenticate)

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const strategies = await prisma.strategy.findMany({
      where: { userId: req.userId },
      include: { journalEntries: true },
      orderBy: { createdAt: 'desc' },
    })
    res.json(strategies)
  } catch (err) {
    console.error('Get strategies error:', err)
    res.status(500).json({ error: 'Something went wrong' })
  }
})

router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const strategy = await prisma.strategy.create({
      data: { ...req.body, userId: req.userId! },
    })
    res.status(201).json(strategy)
  } catch (err) {
    console.error('Create strategy error:', err)
    res.status(500).json({ error: 'Something went wrong' })
  }
})

router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, assetClasses, indicatorsUsed, timeframes, entryRules, exitRules, riskManagement, notes } = req.body
    const strategy = await prisma.strategy.update({
      where: { id: String(req.params.id) },
      data: { name, description, assetClasses, indicatorsUsed, timeframes, entryRules, exitRules, riskManagement, notes },
    })
    res.json(strategy)
  } catch (err) {
    console.error('Update strategy error:', err)
    res.status(500).json({ error: 'Something went wrong' })
  }
})

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    await prisma.strategy.delete({
      where: { id: String(req.params.id) },
    })
    res.json({ message: 'Strategy deleted' })
  } catch (err) {
    console.error('Delete strategy error:', err)
    res.status(500).json({ error: 'Something went wrong' })
  }
})

router.post('/:id/journal', async (req: AuthRequest, res: Response) => {
  try {
    const entry = await prisma.journalEntry.create({
      data: { ...req.body, strategyId: req.params.id },
    })
    res.status(201).json(entry)
  } catch (err) {
    console.error('Create journal entry error:', err)
    res.status(500).json({ error: 'Something went wrong' })
  }
})

router.put('/:id/notes', async (req: AuthRequest, res: Response) => {
  try {
    const strategy = await prisma.strategy.update({
      where: { id: String(req.params.id) },
      data: { notes: req.body.notes },
    })
    res.json(strategy)
  } catch (err) {
    console.error('Update notes error:', err)
    res.status(500).json({ error: 'Something went wrong' })
  }
})

export default router