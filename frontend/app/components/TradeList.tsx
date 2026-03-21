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
  TrendingUp, TrendingDown, DollarSign,
  Target, BarChart2, Flame, Trash2
} from "lucide-react"
import { apiFetch } from "../lib/api"

interface TradeListProps {
  showChartOnly?: boolean
  showTableOnly?: boolean
}

export default function TradeList({ showChartOnly, showTableOnly }: TradeListProps) {
  const [trades, setTrades] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTrades = () => {
    getTrades()
      .then((data: any[]) => {
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
  const totalInvested = trades.reduce((sum, t) => sum + Number(t.amountInvested ?? 0), 0)
  const wins = trades.filter((t) => Number(t.profitLoss ?? 0) > 0)
  const losses = trades.filter((t) => Number(t.profitLoss ?? 0) < 0)
  const winRate = trades.length > 0 ? (wins.length / trades.length) * 100 : 0

  // Win/loss streak
  let currentStreak = 0
  let streakType = ""
  for (let i = 0; i < trades.length; i++) {
    const pl = Number(trades[i].profitLoss ?? 0)
    if (i === 0) {
      currentStreak = 1
      streakType = pl > 0 ? "win" : pl < 0 ? "loss" : ""
    } else {
      const prevPl = Number(trades[i - 1].profitLoss ?? 0)
      const same = (pl > 0 && prevPl > 0) || (pl < 0 && prevPl < 0)
      if (same) currentStreak++
      else break
    }
  }

  // Running P&L per trade
  let running = 0
  const tradesWithRunning = [...trades].reverse().map((t) => {
    running += Number(t.profitLoss ?? 0)
    return { ...t, runningPnL: running }
  }).reverse()

  if (loading) {
    return <p className="text-muted-foreground text-center py-8">Loading trades...</p>
  }

  if (trades.length === 0) {
    return <p className="text-muted-foreground text-center py-8">No trades logged yet.</p>
  }

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
              <p className="text-xs text-muted-foreground">
                from ${totalInvested.toFixed(2)} invested
              </p>
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
              <p className="text-xs text-muted-foreground">
                {streakType === "win" ? "Winning streak" : streakType === "loss" ? "Losing streak" : "No streak"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
              <BarChart2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{trades.length}</div>
              <p className="text-xs text-muted-foreground">
                {trades.filter((t) => t.status === "open").length} open
              </p>
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
                <TableHead>Type</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entry</TableHead>
                <TableHead>Exit</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Invested</TableHead>
                <TableHead>SL / TP</TableHead>
                <TableHead>R:R</TableHead>
                <TableHead>P&L</TableHead>
                <TableHead>% Gain</TableHead>
                <TableHead>Running</TableHead>
                <TableHead>Emotion</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tradesWithRunning.map((trade) => {
                const pl = Number(trade.profitLoss ?? 0)
                const pnlColor = pl > 0 ? "text-green-500" : pl < 0 ? "text-red-500" : ""
                const runningColor = trade.runningPnL > 0 ? "text-green-500" : trade.runningPnL < 0 ? "text-red-500" : ""
                const duration = trade.exitDate
                  ? Math.ceil((new Date(trade.exitDate).getTime() - new Date(trade.entryDate).getTime()) / (1000 * 60 * 60 * 24))
                  : null

                return (
                  <TableRow key={trade.id}>
                    <TableCell className="whitespace-nowrap">
                      <div>{new Date(trade.entryDate).toLocaleDateString()}</div>
                      {duration !== null && (
                        <div className="text-xs text-muted-foreground">{duration}d</div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{trade.symbol}</TableCell>
                    <TableCell className="capitalize">{trade.tradeType}</TableCell>
                    <TableCell>
                      <Badge variant={trade.action === "buy" ? "default" : "secondary"}>
                        {trade.action === "buy" ? "Long" : "Short"}
                      </Badge>
                    </TableCell>
                    <TableCell>${Number(trade.entryPrice).toFixed(4)}</TableCell>
                    <TableCell>
                      {trade.exitPrice ? `$${Number(trade.exitPrice).toFixed(4)}` : "-"}
                    </TableCell>
                    <TableCell>{trade.quantity}</TableCell>
                    <TableCell>
                      {trade.amountInvested ? `$${Number(trade.amountInvested).toFixed(2)}` : "-"}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <span className="text-red-400 text-xs">
                        {trade.stopLoss ? `SL $${Number(trade.stopLoss).toFixed(2)}` : "-"}
                      </span>
                      <br />
                      <span className="text-green-400 text-xs">
                        {trade.takeProfit ? `TP $${Number(trade.takeProfit).toFixed(2)}` : "-"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {trade.riskRewardRatio
                        ? `1:${Number(trade.riskRewardRatio).toFixed(2)}`
                        : "-"}
                    </TableCell>
                    <TableCell className={`font-medium ${pnlColor}`}>
                      {trade.profitLoss !== null
                        ? `${pl >= 0 ? "+" : ""}$${pl.toFixed(2)}`
                        : "-"}
                    </TableCell>
                    <TableCell className={pnlColor}>
                      {trade.percentageGain !== null
                        ? `${Number(trade.percentageGain) >= 0 ? "+" : ""}${Number(trade.percentageGain).toFixed(2)}%`
                        : "-"}
                    </TableCell>
                    <TableCell className={`font-medium ${runningColor}`}>
                      {trade.runningPnL >= 0 ? "+" : ""}${trade.runningPnL.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {trade.emotionalState ? (
                        <Badge variant="outline" className="text-xs">{trade.emotionalState}</Badge>
                      ) : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={trade.status === "open" ? "secondary" : pl > 0 ? "default" : "destructive"}>
                        {trade.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(trade.id)}
                      >
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
    </div>
  )
}