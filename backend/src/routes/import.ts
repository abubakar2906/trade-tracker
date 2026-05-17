import { Router, Response } from 'express'
import multer from 'multer'
import csv from 'csv-parser'
import { Readable } from 'stream'
import { authenticate, AuthRequest } from '../middleware/auth.js'
import prisma from '../db/client.js'
import { generateInsights, getTradeCount, MIN_TRADES_FOR_INSIGHTS } from '../services/ai.js'
import { logger } from '../utils/logger.js'

const router = Router()
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (_, file, cb) => {
    const isCSV = file.mimetype === 'text/csv' || file.mimetype === 'application/vnd.ms-excel' || file.originalname.endsWith('.csv')
    cb(null, isCSV)
  }
})

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

        if (results.length === 0) {
          return res.status(400).json({ error: 'CSV file is empty' })
        }

        // 1. Build Column Mapper
        const COLUMN_ALIASES = {
          symbol: ['symbol', 'item', 'asset', 'ticker', 'instrument', 'market'],
          bias: ['action', 'direction', 'side', 'type', 'position'],
          profitLoss: ['profit', 'p/l', 'pnl', 'net profit', 'gain', 'net gain', 'realized', 'p&l', 'return'],
          date: ['open time', 'time', 'date', 'entry date', 'entry time', 'opened', 'created'],
          entryPrice: ['entry price', 'open price', 'open', 'price', 'entry', 'avg price', 'fill price'],
          exitPrice: ['exit price', 'close price', 'close', 'exit'],
        }

        const headers = Object.keys(results[0]).map(h => h.toLowerCase().trim())
        const fieldMapping: Record<string, string> = {}

        for (const [canonical, aliases] of Object.entries(COLUMN_ALIASES)) {
          for (const alias of aliases) {
            const foundHeader = headers.find(h => h === alias || h.includes(alias))
            if (foundHeader && !Object.values(fieldMapping).includes(foundHeader)) {
              fieldMapping[canonical] = foundHeader
              break
            }
          }
        }

        // Process parsed rows
        for (let i = 0; i < results.length; i++) {
          const row = results[i]
          const normalizedRow: any = {}
          
          for (const key in row) {
            normalizedRow[key.toLowerCase().trim()] = row[key]
          }

          // 2. Extract mapped values
          const symbol = fieldMapping.symbol ? normalizedRow[fieldMapping.symbol] : null
          const actionStr = fieldMapping.bias ? (normalizedRow[fieldMapping.bias] || '') : ''
          const entryDateStr = fieldMapping.date ? normalizedRow[fieldMapping.date] : null
          
          const entryPriceStr = fieldMapping.entryPrice ? normalizedRow[fieldMapping.entryPrice] : null
          const exitPriceStr = fieldMapping.exitPrice ? normalizedRow[fieldMapping.exitPrice] : null
          const profitLossRaw = fieldMapping.profitLoss ? normalizedRow[fieldMapping.profitLoss] : null

          if (!symbol) {
            errors.push(`Row ${i + 1} is missing required symbol. Column mapping failed or data is missing.`)
            continue
          }

          // 3. Transform and calculate missing data
          const bias = actionStr.toLowerCase().includes('sell') || actionStr.toLowerCase().includes('short') ? 'BEARISH' : 'BULLISH'
          const date = entryDateStr ? new Date(entryDateStr) : new Date()
          
          let profitLoss = profitLossRaw ? parseFloat(profitLossRaw.replace(/[^0-9.-]+/g,"")) : null

          // If no P&L but we have entry and exit prices, try to calculate a generic P&L
          // (This is a simplified calculation: just difference. Actual P&L needs position size, but it's a fallback)
          if (profitLoss === null && entryPriceStr && exitPriceStr) {
            const ep = parseFloat(entryPriceStr)
            const xp = parseFloat(exitPriceStr)
            if (!isNaN(ep) && !isNaN(xp)) {
              const diff = bias === 'BULLISH' ? (xp - ep) : (ep - xp)
              profitLoss = diff // Arbitrary generic diff if no quantity is known
            }
          }

          let winLoss = 'BREAKEVEN' // Fallback
          if (profitLoss !== null) {
            winLoss = profitLoss > 0 ? 'WIN' : profitLoss < 0 ? 'LOSS' : 'BREAKEVEN'
          }

          try {
            await prisma.trade.create({
              data: {
                userId: req.userId!,
                symbol: symbol.toString().toUpperCase(),
                bias: bias as any,
                date: isNaN(date.getTime()) ? new Date() : date, // Fallback to now if invalid date
                entryPoint: entryPriceStr ? entryPriceStr.toString() : null,
                profitLoss,
                winLoss: winLoss as any,
                comment: 'Imported via CSV',
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
          mappedColumns: fieldMapping // Send back what was mapped for transparency
        })

        // Fire-and-forget: trigger AI insights if threshold met
        if (imported > 0) {
          getTradeCount(req.userId!).then(count => {
            if (count >= MIN_TRADES_FOR_INSIGHTS) {
              generateInsights(req.userId!)
                .then(insights => logger.info({ userId: req.userId, count: insights.length }, 'Auto-generated insights after CSV import'))
                .catch(err => logger.error(err, 'Auto insight generation failed after CSV import'))
            }
          }).catch(() => {})
        }
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
