import Groq from 'groq-sdk'
import prisma from '../db/client.js'
import { INSIGHT_SYSTEM_PROMPT, CHAT_SYSTEM_PROMPT } from '../prompts/system.js'
import { logger } from '../utils/logger.js'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const MODEL = 'llama-3.3-70b-versatile'
const MIN_TRADES_FOR_INSIGHTS = 10

// ─── Types ──────────────────────────────────────────────────────────────────────

interface RawInsight {
  type: 'PERFORMANCE' | 'EMOTIONAL' | 'STRATEGY' | 'RISK' | 'MARKET'
  severity: 'INFO' | 'WARNING' | 'CRITICAL'
  title: string
  finding: string
  recommendation: string
}

// ─── Context Builder ────────────────────────────────────────────────────────────
// This function assembles the dense context block that makes insights personal.

async function buildContextBlock(userId: string): Promise<string> {
  // Fetch trades (last 50, sorted by date desc)
  const trades = await prisma.trade.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
    take: 50,
  })

  if (trades.length < MIN_TRADES_FOR_INSIGHTS) {
    throw new Error(`Need at least ${MIN_TRADES_FOR_INSIGHTS} trades for analysis. Currently have ${trades.length}.`)
  }

  // Fetch strategy definitions (if any)
  const strategies = await prisma.strategy.findMany({
    where: { userId },
    select: { name: true, entryRules: true, exitRules: true, riskManagement: true, timeframes: true },
  })

  // ── Compute aggregated stats ──────────────────────────────────────────────

  const allTrades = await prisma.trade.findMany({ where: { userId } })
  const total = allTrades.length
  const wins = allTrades.filter(t => t.winLoss === 'WIN' || (t.profitLoss !== null && t.profitLoss > 0)).length
  const losses = allTrades.filter(t => t.winLoss === 'LOSS' || (t.profitLoss !== null && t.profitLoss < 0)).length
  const winRate = total > 0 ? ((wins / total) * 100).toFixed(1) : '0'

  const grossProfit = allTrades
    .filter(t => t.profitLoss !== null && t.profitLoss > 0)
    .reduce((sum, t) => sum + (t.profitLoss ?? 0), 0)
  const grossLoss = allTrades
    .filter(t => t.profitLoss !== null && t.profitLoss < 0)
    .reduce((sum, t) => sum + Math.abs(t.profitLoss ?? 0), 0)
  const profitFactor = grossLoss > 0 ? (grossProfit / grossLoss).toFixed(2) : (grossProfit > 0 ? '∞' : '0')
  const totalPnL = allTrades.reduce((sum, t) => sum + (t.profitLoss ?? 0), 0).toFixed(2)

  // ── Symbol breakdown ──────────────────────────────────────────────────────

  const symbolMap: Record<string, { wins: number; losses: number; pnl: number }> = {}
  for (const t of allTrades) {
    if (!symbolMap[t.symbol]) symbolMap[t.symbol] = { wins: 0, losses: 0, pnl: 0 }
    symbolMap[t.symbol].pnl += t.profitLoss ?? 0
    if (t.winLoss === 'WIN' || (t.profitLoss !== null && t.profitLoss > 0)) symbolMap[t.symbol].wins++
    else symbolMap[t.symbol].losses++
  }
  const symbolBreakdown = Object.entries(symbolMap)
    .map(([sym, d]) => `${sym}: ${d.wins}W/${d.losses}L, P&L $${d.pnl.toFixed(2)}, WR ${((d.wins / (d.wins + d.losses)) * 100).toFixed(0)}%`)
    .join('\n  ')

  // ── Emotion breakdown ─────────────────────────────────────────────────────

  const emotionMap: Record<string, { wins: number; losses: number; pnl: number }> = {}
  for (const t of allTrades) {
    for (const emo of t.emotions) {
      if (!emotionMap[emo]) emotionMap[emo] = { wins: 0, losses: 0, pnl: 0 }
      emotionMap[emo].pnl += t.profitLoss ?? 0
      if (t.winLoss === 'WIN' || (t.profitLoss !== null && t.profitLoss > 0)) emotionMap[emo].wins++
      else emotionMap[emo].losses++
    }
  }
  const emotionBreakdown = Object.entries(emotionMap)
    .map(([emo, d]) => `${emo}: ${d.wins}W/${d.losses}L, Avg P&L $${(d.pnl / (d.wins + d.losses)).toFixed(2)}`)
    .join('\n  ')

  // ── Setup breakdown ───────────────────────────────────────────────────────

  const setupMap: Record<string, { wins: number; losses: number }> = {}
  for (const t of allTrades) {
    for (const setup of t.setups) {
      if (!setupMap[setup]) setupMap[setup] = { wins: 0, losses: 0 }
      if (t.winLoss === 'WIN' || (t.profitLoss !== null && t.profitLoss > 0)) setupMap[setup].wins++
      else setupMap[setup].losses++
    }
  }
  const setupBreakdown = Object.entries(setupMap)
    .map(([s, d]) => `${s}: ${d.wins}W/${d.losses}L, WR ${((d.wins / (d.wins + d.losses)) * 100).toFixed(0)}%`)
    .join('\n  ')

  // ── Bias accuracy ─────────────────────────────────────────────────────────

  const bullishTrades = allTrades.filter(t => t.bias === 'BULLISH')
  const bearishTrades = allTrades.filter(t => t.bias === 'BEARISH')
  const bullishWins = bullishTrades.filter(t => t.winLoss === 'WIN' || (t.profitLoss !== null && t.profitLoss > 0)).length
  const bearishWins = bearishTrades.filter(t => t.winLoss === 'WIN' || (t.profitLoss !== null && t.profitLoss > 0)).length
  const biasBreakdown = `Bullish: ${bullishWins}/${bullishTrades.length} wins (${bullishTrades.length > 0 ? ((bullishWins / bullishTrades.length) * 100).toFixed(0) : 0}%), Bearish: ${bearishWins}/${bearishTrades.length} wins (${bearishTrades.length > 0 ? ((bearishWins / bearishTrades.length) * 100).toFixed(0) : 0}%)`

  // ── Day-of-week breakdown ─────────────────────────────────────────────────

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const dayMap: Record<string, { wins: number; losses: number }> = {}
  for (const t of allTrades) {
    const day = dayNames[new Date(t.date).getDay()]
    if (!dayMap[day]) dayMap[day] = { wins: 0, losses: 0 }
    if (t.winLoss === 'WIN' || (t.profitLoss !== null && t.profitLoss > 0)) dayMap[day].wins++
    else dayMap[day].losses++
  }
  const dayBreakdown = Object.entries(dayMap)
    .map(([day, d]) => `${day}: ${d.wins}W/${d.losses}L, WR ${((d.wins / (d.wins + d.losses)) * 100).toFixed(0)}%`)
    .join('\n  ')

  // ── Compact trade list (last 50) ──────────────────────────────────────────

  const tradeRows = trades.map(t => ({
    date: new Date(t.date).toISOString().split('T')[0],
    symbol: t.symbol,
    bias: t.bias,
    result: t.winLoss ?? 'PENDING',
    pnl: t.profitLoss ?? 0,
    emotions: t.emotions,
    setups: t.setups,
    timeframes: t.timeframes,
  }))

  // ── Strategy context ──────────────────────────────────────────────────────

  let strategyContext = 'No strategy defined.'
  if (strategies.length > 0) {
    strategyContext = strategies.map(s =>
      `Strategy "${s.name}": Entry rules: ${s.entryRules || 'Not specified'}. Exit rules: ${s.exitRules || 'Not specified'}. Risk management: ${s.riskManagement || 'Not specified'}. Timeframes: ${s.timeframes || 'Not specified'}.`
    ).join('\n')
  }

  // ── Fetch upcoming news ───────────────────────────────────────────────────

  let newsContext = 'No upcoming news data available.'
  try {
    const newsRes = await fetch('https://nfs.faireconomy.media/ff_calendar_thisweek.json')
    if (newsRes.ok) {
      const newsData: any[] = await newsRes.json()
      const now = new Date()
      const upcoming = newsData
        .filter((e: any) => (e.impact === 'High' || e.impact === 'Medium') && new Date(e.date) > now)
        .slice(0, 10)
      if (upcoming.length > 0) {
        newsContext = upcoming.map((e: any) => `${e.country} - ${e.title} (${e.impact} impact) on ${new Date(e.date).toLocaleString()}, Forecast: ${e.forecast || 'N/A'}, Previous: ${e.previous || 'N/A'}`).join('\n  ')
      }
    }
  } catch { newsContext = 'News fetch failed.' }

  // ── Assemble ──────────────────────────────────────────────────────────────

  return `
=== TRADER'S STRATEGY ===
${strategyContext}

=== AGGREGATED STATISTICS ===
Total trades: ${total}
Wins: ${wins} | Losses: ${losses} | Win Rate: ${winRate}%
Total P&L: $${totalPnL}
Profit Factor: ${profitFactor}
Gross Profit: $${grossProfit.toFixed(2)} | Gross Loss: $${grossLoss.toFixed(2)}

=== BIAS ACCURACY ===
${biasBreakdown}

=== SYMBOL BREAKDOWN ===
  ${symbolBreakdown || 'No symbol data'}

=== EMOTION BREAKDOWN ===
  ${emotionBreakdown || 'No emotion tags yet'}

=== SETUP BREAKDOWN ===
  ${setupBreakdown || 'No setup tags yet'}

=== DAY OF WEEK BREAKDOWN ===
  ${dayBreakdown || 'No day data'}

=== UPCOMING NEWS EVENTS ===
  ${newsContext}

=== LAST ${trades.length} TRADES ===
${JSON.stringify(tradeRows, null, 0)}
`.trim()
}

// ─── Generate Insights ──────────────────────────────────────────────────────────

async function callGroqWithRetry(contextBlock: string, attempt = 1): Promise<string> {
  // Use a smaller model on retries to avoid context overflows
  const model = attempt === 1 ? MODEL : 'llama-3.1-8b-instant'
  // Truncate context on retries to avoid token limits
  const context = attempt === 1 ? contextBlock : contextBlock.slice(0, 8000)

  const completion = await groq.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: INSIGHT_SYSTEM_PROMPT },
      { role: 'user', content: `Analyze my trading data and return exactly 5 insight cards as JSON.\n\n${context}` },
    ],
    temperature: attempt === 1 ? 0.4 : 0.2,
    max_tokens: 2500,
    response_format: { type: 'json_object' },
  })

  const raw = completion.choices[0]?.message?.content
  if (!raw || raw.trim() === '') {
    if (attempt < 3) {
      logger.warn({ attempt }, 'Empty Groq response, retrying...')
      await new Promise(r => setTimeout(r, 1000 * attempt))
      return callGroqWithRetry(contextBlock, attempt + 1)
    }
    throw new Error('Groq returned empty response after 3 attempts')
  }
  return raw
}

export async function generateInsights(userId: string) {
  const contextBlock = await buildContextBlock(userId)

  logger.info({ userId, contextLength: contextBlock.length }, 'Sending context to Groq for insight generation')

  const raw = await callGroqWithRetry(contextBlock)

  logger.info({ userId, rawLength: raw.length }, 'Received raw response from Groq')

  // Parse — handle both { insights: [...] } and plain array
  let insights: RawInsight[]
  try {
    const parsed = JSON.parse(raw)
    insights = Array.isArray(parsed) ? parsed : (parsed.insights || parsed.cards || parsed.data || [])
  } catch (e) {
    logger.error({ raw }, 'Failed to parse Groq response as JSON')
    throw new Error('AI returned invalid JSON')
  }

  if (!Array.isArray(insights) || insights.length === 0) {
    throw new Error('AI returned no insights')
  }

  // Validate and sanitize each insight
  const validTypes = ['PERFORMANCE', 'EMOTIONAL', 'STRATEGY', 'RISK', 'MARKET'] as const
  const validSeverities = ['INFO', 'WARNING', 'CRITICAL'] as const

  const sanitized = insights
    .filter(i => i.title && i.finding && i.recommendation)
    .map(i => ({
      type: validTypes.includes(i.type as any) ? i.type : 'PERFORMANCE',
      severity: validSeverities.includes(i.severity as any) ? i.severity : 'INFO',
      title: i.title.slice(0, 100),
      finding: i.finding.slice(0, 500),
      recommendation: i.recommendation.slice(0, 500),
    }))

  // Delete old + insert new — avoid transaction timeout by doing them sequentially
  await prisma.aIInsight.deleteMany({ where: { userId } })

  const created: any[] = []
  for (const insight of sanitized) {
    const row = await prisma.aIInsight.create({
      data: {
        userId,
        type: insight.type as any,
        severity: insight.severity as any,
        title: insight.title,
        finding: insight.finding,
        recommendation: insight.recommendation,
      },
    })
    created.push(row)
  }

  logger.info({ userId, count: created.length }, 'Insights stored successfully')
  return created
}


// ─── Chat ───────────────────────────────────────────────────────────────────────

export async function chatWithCoach(userId: string, message: string, history: { role: string; content: string }[] = []) {
  const contextBlock = await buildContextBlock(userId)

  const messages: any[] = [
    { role: 'system', content: `${CHAT_SYSTEM_PROMPT}\n\nHere is the trader's full data for reference:\n\n${contextBlock}` },
    ...history.map(h => ({ role: h.role, content: h.content })),
    { role: 'user', content: message },
  ]

  const completion = await groq.chat.completions.create({
    model: MODEL,
    messages,
    temperature: 0.6,
    max_tokens: 1500,
  })

  return completion.choices[0]?.message?.content || 'I couldn\'t generate a response. Please try again.'
}

// ─── Helpers ────────────────────────────────────────────────────────────────────

export async function getTradeCount(userId: string): Promise<number> {
  return prisma.trade.count({ where: { userId } })
}

export { MIN_TRADES_FOR_INSIGHTS }
