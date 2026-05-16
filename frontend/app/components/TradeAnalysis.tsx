"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import type { Trade } from "../types/trade"

interface TradeAnalysisProps {
  trades: Trade[]
}

export default function TradeAnalysis({ trades }: TradeAnalysisProps) {
  const [timeframe, setTimeframe] = useState("all")

  // Helper function to calculate metrics
  const calculateMetrics = (filteredTrades: Trade[]) => {
    let totalProfit = 0
    let winCount = 0
    let lossCount = 0
    let maxDrawdown = 0
    let peak = 0
    const returns: number[] = []

    filteredTrades.forEach((trade, index) => {
      const profit = Number(trade.profitLoss ?? 0)
      totalProfit += profit

      if (profit > 0 || trade.winLoss === "WIN") winCount++
      else if (profit < 0 || trade.winLoss === "LOSS") lossCount++

      if (totalProfit > peak) {
        peak = totalProfit
      } else {
        const drawdown = peak - totalProfit
        if (drawdown > maxDrawdown) maxDrawdown = drawdown
      }

      if (index > 0) {
        const prevTotalProfit = filteredTrades
          .slice(0, index)
          .reduce((sum, t) => sum + Number(t.profitLoss ?? 0), 0)
        
        if (prevTotalProfit !== 0) {
            returns.push((totalProfit - prevTotalProfit) / Math.abs(prevTotalProfit))
        }
      }
    })

    const winRate = (winCount + lossCount) > 0 ? winCount / (winCount + lossCount) : 0
    const averageReturn = returns.length > 0 ? returns.reduce((sum, r) => sum + r, 0) / returns.length : 0
    const stdDeviation = returns.length > 0 ? Math.sqrt(returns.reduce((sum, r) => sum + Math.pow(r - averageReturn, 2), 0) / returns.length) : 0
    const sharpeRatio = stdDeviation > 0 ? (averageReturn / stdDeviation) * Math.sqrt(252) : 0

    return {
      totalProfit,
      winRate,
      maxDrawdown,
      sharpeRatio,
    }
  }

  const filterTrades = (period: string) => {
    const now = new Date()
    const periodStart = new Date()

    switch (period) {
      case "week":
        periodStart.setDate(now.getDate() - 7)
        break
      case "month":
        periodStart.setMonth(now.getMonth() - 1)
        break
      case "year":
        periodStart.setFullYear(now.getFullYear() - 1)
        break
    }

    return trades.filter(
      (trade) => period === "all" || new Date(trade.date) >= periodStart
    )
  }

  const filteredTrades = filterTrades(timeframe)
  const metrics = calculateMetrics(filteredTrades)

  let runningProfit = 0
  const chartData = filteredTrades.map((trade, index) => {
    runningProfit += Number(trade.profitLoss ?? 0)
    return {
      tradeNumber: index + 1,
      profit: runningProfit,
    }
  })

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Trade Analysis</h2>
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="year">Past Year</SelectItem>
            <SelectItem value="month">Past Month</SelectItem>
            <SelectItem value="week">Past Week</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Profit</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">${metrics.totalProfit.toFixed(2)}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Win Rate</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{(metrics.winRate * 100).toFixed(2)}%</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Max Drawdown</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">${metrics.maxDrawdown.toFixed(2)}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Sharpe Ratio</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{metrics.sharpeRatio.toFixed(2)}</div></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cumulative P&L Over Time</CardTitle>
          <CardDescription>Equity curve based on logged trades</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="tradeNumber" />
                <YAxis />
                <Tooltip contentStyle={{ backgroundColor: '#1c1c1c', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="profit" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
