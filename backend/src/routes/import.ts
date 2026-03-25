import { Router, Response } from 'express'
import multer from 'multer'
import csv from 'csv-parser'
import { Readable } from 'stream'
import { authenticate, AuthRequest } from '../middleware/auth.js'
import prisma from '../db/client.js'

const router = Router()
const upload = multer({ storage: multer.memoryStorage() })

router.use(authenticate)

router.post('/csv', upload.single('file'), async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file provided' })
      return
    }

    const results: any[] = []
    
    // Create a readable stream from the uploaded file buffer
    const stream = Readable.from(req.file.buffer)

    stream
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        let imported = 0
        const errors: string[] = []

        // Process parsed rows
        for (let i = 0; i < results.length; i++) {
          const row = results[i]
          
          // Normalize keys by converting to lowercase and trimming
          const normalizedRow: any = {}
          for (const key in row) {
            normalizedRow[key.toLowerCase().trim()] = row[key]
          }

          // Try to extract common fields
          const symbol = normalizedRow['symbol'] || normalizedRow['item'] || normalizedRow['asset']
          const tradeType = normalizedRow['type'] || normalizedRow['tradetype'] || 'forex'
          const actionStr = normalizedRow['action'] || normalizedRow['direction'] || ''
          const action = actionStr.toLowerCase().includes('sell') ? 'sell' : 'buy'

          const entryPrice = parseFloat(normalizedRow['open price'] || normalizedRow['entry'] || normalizedRow['price'] || '0')
          const exitPriceStr = normalizedRow['close price'] || normalizedRow['exit'] || normalizedRow['close']
          const exitPrice = exitPriceStr ? parseFloat(exitPriceStr) : null
          
          const quantity = parseFloat(normalizedRow['size'] || normalizedRow['volume'] || normalizedRow['quantity'] || '0')
          const profitLoss = parseFloat(normalizedRow['profit'] || normalizedRow['p/l'] || normalizedRow['pnL'] || '0')
          
          const entryDateStr = normalizedRow['open time'] || normalizedRow['time'] || normalizedRow['date']
          const exitDateStr = normalizedRow['close time'] || normalizedRow['exittime']
          
          const entryDate = entryDateStr ? new Date(entryDateStr) : new Date()
          const exitDate = exitDateStr ? new Date(exitDateStr) : null

          if (!symbol || isNaN(entryPrice)) {
            errors.push(`Row ${i + 1} is missing required symbol or price.`)
            continue
          }

          try {
            await prisma.trade.create({
              data: {
                userId: req.userId!,
                symbol,
                tradeType,
                action,
                entryPrice,
                exitPrice,
                quantity,
                profitLoss,
                status: exitPrice ? 'closed' : 'open',
                entryDate,
                exitDate,
                notes: 'Imported via CSV',
              },
            })
            imported++
          } catch (e: any) {
            console.error(`Error importing row ${i + 1}:`, e)
            errors.push(`Row ${i + 1} failed to save: ${e.message}`)
          }
        }

        res.json({
          message: `Successfully imported ${imported} trades.`,
          imported,
          errors: errors.length > 0 ? errors : undefined,
        })
      })
      .on('error', (err) => {
        console.error('CSV Parsing error:', err)
        res.status(500).json({ error: 'Failed to parse CSV file' })
      })

  } catch (err) {
    console.error('CSV Import error:', err)
    res.status(500).json({ error: 'Something went wrong during import' })
  }
})

export default router
