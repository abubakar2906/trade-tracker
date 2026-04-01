import { Router, Response } from 'express'
import { authenticate, AuthRequest } from '../middleware/auth.js'
import prisma from '../db/client.js'
import { NodeSSH } from 'node-ssh'

const router = Router()
const ssh = new NodeSSH()
router.use(authenticate)

// Connect a new broker account (Now triggers your VPS)
router.post('/connect', async (req: AuthRequest, res: Response) => {
  const { name, accountId, password, brokerServer, platform } = req.body
  
  try {
    // 1. Connect to your Contabo VPS
    await ssh.connect({
      host: process.env.CONTABO_IP,
      username: 'root',
      password: process.env.CONTABO_PASSWORD,
      readyTimeout: 40000, 
      keepaliveInterval: 10000 
    })

    // 2. Trigger the sync script we created on the VPS
    // This clones the template and starts the terminal
    const command = `~/sync_broker.sh ${req.userId} ${accountId} "${password}" "${brokerServer}"`
    const result = await ssh.execCommand(command)
    
    ssh.dispose()

    if (result.stderr) {
        console.error('VPS Script Error:', result.stderr)
        throw new Error('Failed to launch terminal on trading server')
    }

    // 3. Save to database (removing MetaApi IDs)
    const brokerAccount = await prisma.brokerAccount.create({
      data: {
        userId: req.userId!,
        name: name || `Account ${accountId}`,
        accountId,
        brokerServer,
        platform: platform || 'mt5',
        status: 'connected', // It's now running on your VPS
      },
    })

    res.status(201).json(brokerAccount)
  } catch (err: any) {
    console.error('Connect broker error:', err)
    res.status(500).json({ error: err.message || 'Failed to connect broker account' })
  }
})

// The "Sync" button is now handled AUTOMATICALLY by the Webhook 
// coming into your /api/trades route. You don't need to manually 
// fetch history here anymore unless you want a "Full Refresh".
router.post('/:id/sync', async (req: AuthRequest, res: Response) => {
    res.json({ message: "Sync is now handled live via VPS Webhook." })
})

// Delete broker account (Kills the process on VPS)
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const brokerAccount = await prisma.brokerAccount.findFirst({
      where: { id: req.params.id as string, userId: req.userId },
    })

    if (!brokerAccount) return res.status(404).json({ error: 'Not found' })

    // Optional: Add SSH logic here to 'pkill' the specific wine process 
    // or delete the folder on the VPS to clean up.

    await prisma.brokerAccount.delete({ where: { id: brokerAccount.id } })
    res.json({ message: 'Broker account removed from VPS tracker' })
  } catch (err: any) {
    res.status(500).json({ error: 'Something went wrong' })
  }
})

export default router