import { Router, Response } from 'express'
import { authenticate, AuthRequest } from '../middleware/auth.js'

const router = Router()

// Simple in-memory cache
let cachedNews: any[] | null = null
let lastFetched: number = 0
const CACHE_DURATION_MS = 60 * 60 * 1000 // 1 hour

router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const now = Date.now()

    // Return cache if valid
    if (cachedNews && (now - lastFetched < CACHE_DURATION_MS)) {
      res.json(cachedNews)
      return
    }

    // Otherwise, fetch from ForexFactory
    const response = await fetch('https://nfs.faireconomy.media/ff_calendar_thisweek.json')
    if (!response.ok) {
      throw new Error(`ForexFactory API returned ${response.status}`)
    }

    const data: any[] = await response.json()

    // Filter only High and Medium impact events (exclude Low and holidays if preferred)
    // We'll return High and Medium so the UI widget is populated, but the UI can choose to only alert on High.
    const filteredEvents = data.filter((event) => 
      event.impact === 'High' || event.impact === 'Medium'
    )

    // TODO: UNCOMMENT TO TEST THE UI TOAST NOTIFICATION 
    /*
    const mockDate = new Date(now + 14 * 60 * 1000).toISOString()
    filteredEvents.unshift({
      title: "MOCK: Fed Interest Rate Decision",
      country: "USD",
      date: mockDate,
      impact: "High",
      forecast: "5.5%",
      previous: "5.5%"
    })
    */

    // Update cache
    cachedNews = filteredEvents
    lastFetched = now

    res.json(cachedNews)
  } catch (err: any) {
    console.error('Error fetching economic news:', err)
    
    // Fallback to cache if we have one, even if it's expired
    if (cachedNews) {
      res.json(cachedNews)
    } else {
      res.status(500).json({ error: 'Failed to fetch economic news' })
    }
  }
})

export default router
