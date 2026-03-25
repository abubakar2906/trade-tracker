import { Router, Response } from 'express'
import { authenticate, AuthRequest } from '../middleware/auth.js'
import prisma from '../db/client.js'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

const router = Router()
router.use(authenticate)

const MetaApiPkg = require('metaapi.cloud-sdk')
const MetaApi: any = MetaApiPkg.default || MetaApiPkg
const api = new MetaApi(process.env.METAAPI_TOKEN!)

// Get all broker accounts for user
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const accounts = await prisma.brokerAccount.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
    })
    res.json(accounts)
  } catch (err) {
    console.error('Get broker accounts error:', err)
    res.status(500).json({ error: 'Something went wrong' })
  }
})

// Connect a new broker account
router.post('/connect', async (req: AuthRequest, res: Response) => {
  const { name, accountId, password, brokerServer, platform } = req.body
  try {
    // Create account in MetaAPI
    const account = await api.metatraderAccountApi.createAccount({
      name: name || `Account ${accountId}`,
      type: 'cloud',
      login: accountId,
      password,
      server: brokerServer,
      platform: platform || 'mt5',
      application: 'MetaApi',
      magic: 0,
    })

    // Wait for account to deploy
    await account.deploy()
    await account.waitConnected()

    // Save to database
    const brokerAccount = await prisma.brokerAccount.create({
      data: {
        userId: req.userId!,
        name: name || `Account ${accountId}`,
        accountId,
        brokerServer,
        platform: platform || 'mt5',
        metaApiId: account.id,
        status: 'connected',
      },
    })

    res.status(201).json(brokerAccount)
  } catch (err: any) {
    console.error('Connect broker error:', err)
    res.status(500).json({ error: err.message || 'Failed to connect broker account' })
  }
})

// Sync trades from broker
router.post('/:id/sync', async (req: AuthRequest, res: Response) => {
  try {
    const brokerAccount = await prisma.brokerAccount.findFirst({
      where: { id: req.params.id as string, userId: req.userId },
    })

    if (!brokerAccount) {
      res.status(404).json({ error: 'Broker account not found' })
      return
    }

    // Get account from MetaAPI
    const account = await api.metatraderAccountApi.getAccount(brokerAccount.metaApiId!)
    const connection = account.getRPCConnection()
    await connection.connect()
    await connection.waitSynchronized()

    // Fetch trade history
    const now = new Date()
    const from = new Date()
    from.setFullYear(from.getFullYear() - 1) // Last 1 year

    const history = await connection.getDealsByTimeRange(from, now)

    let imported = 0

    for (const deal of history.deals) {
      // Skip non-trade deals
      if (deal.type !== 'DEAL_TYPE_BUY' && deal.type !== 'DEAL_TYPE_SELL') continue
      if (deal.entryType !== 'DEAL_ENTRY_OUT') continue // Only closed trades

      const existingTrade = await prisma.trade.findFirst({
        where: {
          userId: req.userId!,
          notes: `metaapi_${deal.id}`,
        },
      })

      if (existingTrade) continue // Skip already imported

      const action = deal.type === 'DEAL_TYPE_BUY' ? 'buy' : 'sell'
      const profitLoss = deal.profit || 0

      await prisma.trade.create({
        data: {
          userId: req.userId!,
          symbol: deal.symbol,
          tradeType: 'forex',
          action,
          entryPrice: deal.price || 0,
          exitPrice: deal.price || 0,
          quantity: deal.volume || 0,
          profitLoss,
          status: 'closed',
          entryDate: new Date(deal.time),
          exitDate: new Date(deal.time),
          notes: `metaapi_${deal.id}`,
        },
      })

      imported++
    }

    // Update last sync time
    await prisma.brokerAccount.update({
      where: { id: brokerAccount.id },
      data: { lastSync: new Date(), status: 'connected' },
    })

    await connection.close()

    res.json({ message: `Successfully imported ${imported} trades`, imported })
  } catch (err: any) {
    console.error('Sync trades error:', err)
    res.status(500).json({ error: err.message || 'Failed to sync trades' })
  }
})

// Delete broker account
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const brokerAccount = await prisma.brokerAccount.findFirst({
      where: { id: req.params.id as string, userId: req.userId },
    })

    if (!brokerAccount) {
      res.status(404).json({ error: 'Broker account not found' })
      return
    }

    // Remove from MetaAPI
    if (brokerAccount.metaApiId) {
      try {
        const account = await api.metatraderAccountApi.getAccount(brokerAccount.metaApiId)
        await account.undeploy()
        await account.remove()
      } catch (err) {
        console.error('MetaAPI remove error:', err)
      }
    }

    await prisma.brokerAccount.delete({
      where: { id: brokerAccount.id },
    })

    res.json({ message: 'Broker account removed' })
  } catch (err: any) {
    console.error('Delete broker error:', err)
    res.status(500).json({ error: 'Something went wrong' })
  }
})

export default router