"use client"
import { useEffect, useState } from "react"
import { getTrades } from "../lib/trades"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import {
  DollarSign, Target, BarChart2, Flame, Trash2
} from "lucide-react"
import { apiFetch } from "../lib/api"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts'
import type { Trade } from "../types/trade"

interface TradeListProps {
  showChartOnly?: boolean
  showTableOnly?: boolean
}

export default function TradeList({ showChartOnly, showTableOnly }: TradeListProps) {
  const [trades, setTrades] = useState<Trade[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTrades = () => {
    getTrades()
      .then((data: Trade[]) => {
        setTrades(data)
        setLoading(false)
      })
      .catch(console.error)
  }

  useEffect(() => {
    fetchTrades()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this trade?")) return
    try {
      await apiFetch(`/api/trades/${id}`, { method: "DELETE" })
      setTrades((prev) => prev.filter((t) => t.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  // --- Stats calculations ---
  const totalPnL = trades.reduce((sum, t) => sum + Number(t.profitLoss ?? 0), 0)
  const wins = trades.filter((t) => t.winLoss === "WIN" || Number(t.profitLoss) > 0)
  const losses = trades.filter((t) => t.winLoss === "LOSS" || Number(t.profitLoss) < 0)
  const winRate = trades.length > 0 ? (wins.length / trades.length) * 100 : 0

  // Win/loss streak
  let currentStreak = 0
  let streakType = ""
  for (let i = 0; i < trades.length; i++) {
    const isWin = trades[i].winLoss === "WIN" || Number(trades[i].profitLoss) > 0
    const isLoss = trades[i].winLoss === "LOSS" || Number(trades[i].profitLoss) < 0
    if (i === 0) {
      currentStreak = 1
      streakType = isWin ? "win" : isLoss ? "loss" : ""
    } else {
      const prevIsWin = trades[i - 1].winLoss === "WIN" || Number(trades[i - 1].profitLoss) > 0
      const prevIsLoss = trades[i - 1].winLoss === "LOSS" || Number(trades[i - 1].profitLoss) < 0
      const same = (isWin && prevIsWin) || (isLoss && prevIsLoss)
      if (same) currentStreak++
      else break
    }
  }

  // Running P&L per trade
  let running = 0
  const tradesWithRunning = [...trades].reverse().map((t) => {
    running += Number(t.profitLoss ?? 0)
    return { ...t, runningPnL: running, displayDate: new Date(t.date).toLocaleDateString() }
  }).reverse()

  // Data for Asset Performance chart
  const assetMap: Record<string, number> = {}
  trades.forEach(t => {
    if (!assetMap[t.symbol]) assetMap[t.symbol] = 0
    assetMap[t.symbol] += Number(t.profitLoss ?? 0)
  })
  const assetData = Object.entries(assetMap)
    .map(([symbol, profit]) => ({ symbol, profit }))
    .sort((a, b) => b.profit - a.profit)

  if (loading) return <p className="text-muted-foreground text-center py-8">Loading trades...</p>
  if (trades.length === 0) return <p className="text-muted-foreground text-center py-8">No trades logged yet.</p>

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      {!showChartOnly && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${totalPnL >= 0 ? "text-green-500" : "text-red-500"}`}>
                {totalPnL >= 0 ? "+" : ""}${totalPnL.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{winRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                {wins.length}W / {losses.length}L
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
              <Flame className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${streakType === "win" ? "text-green-500" : streakType === "loss" ? "text-red-500" : ""}`}>
                {currentStreak} {streakType === "win" ? "W" : streakType === "loss" ? "L" : "-"}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
              <BarChart2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{trades.length}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Detailed Table */}
      {!showChartOnly && (
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead>Bias</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Trigger</TableHead>
                <TableHead>R:R</TableHead>
                <TableHead>P&L</TableHead>
                <TableHead>Running</TableHead>
                <TableHead>Result</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tradesWithRunning.map((trade) => {
                const pl = Number(trade.profitLoss ?? 0)
                const pnlColor = pl > 0 ? "text-green-500" : pl < 0 ? "text-red-500" : ""
                const runningColor = trade.runningPnL > 0 ? "text-green-500" : trade.runningPnL < 0 ? "text-red-500" : ""

                return (
                  <TableRow key={trade.id}>
                    <TableCell className="whitespace-nowrap">
                      <div>{new Date(trade.date).toLocaleDateString()}</div>
                      {trade.tradeDuration && <div className="text-xs text-muted-foreground">{trade.tradeDuration}</div>}
                    </TableCell>
                    <TableCell className="font-bold">{trade.symbol}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={trade.bias === "BULLISH" ? "text-green-500 border-green-500/20" : trade.bias === "BEARISH" ? "text-red-500 border-red-500/20" : ""}>
                        {trade.bias}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-[150px]">
                        {trade.setups?.map(s => <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>)}
                        {trade.timeframes?.map(t => <Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>)}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[120px] truncate" title={trade.entryPoint || ""}>
                      {trade.entryPoint || "—"}
                    </TableCell>
                    <TableCell className="font-medium text-muted-foreground">
                      {trade.riskReward || "—"}
                    </TableCell>
                    <TableCell className={`font-medium ${pnlColor}`}>
                      {trade.profitLoss !== null
                        ? `${pl >= 0 ? "+" : ""}$${Math.abs(pl).toFixed(2)}`
                        : "—"}
                    </TableCell>
                    <TableCell className={`font-medium ${runningColor}`}>
                      {trade.runningPnL >= 0 ? "+" : ""}${Math.abs(trade.runningPnL).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={trade.winLoss === "WIN" ? "default" : trade.winLoss === "LOSS" ? "destructive" : "secondary"}>
                        {trade.winLoss || "PENDING"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(trade.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Performance Charts */}
      {showChartOnly && tradesWithRunning.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-[300px] sm:h-[400px] w-full col-span-1 lg:col-span-2">
            <h3 className="text-lg font-semibold mb-6">Equity Curve (Running P&L)</h3>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[...tradesWithRunning].reverse()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPnL" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                <XAxis dataKey="displayDate" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} tickMargin={10} />
                <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(value: number) => `$${value}`} tickMargin={10} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1c1c1c', borderRadius: '8px', border: '1px solid #333', color: '#f3f4f6', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Running P&L']}
                />
                <Area type="monotone" dataKey="runningPnL" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorPnL)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}