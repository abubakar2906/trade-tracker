"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import type { Trade } from "../types/trade"

interface TradeStatisticsProps {
  trades: Trade[]
}

export default function TradeStatistics({ trades }: TradeStatisticsProps) {
  const [timeframe, setTimeframe] = useState("all")

  const calculateStatistics = (filteredTrades: Trade[]) => {
    let totalProfit = 0
    let winCount = 0
    let lossCount = 0
    let maxDrawdown = 0
    let peak = 0
    let longestWinStreak = 0
    let longestLoseStreak = 0
    let currentStreak = 0
    let grossProfit = 0
    let grossLoss = 0

    const profitBySymbol: { [key: string]: number } = {}
    const tradesByDay: { [key: string]: number } = {}

    filteredTrades.forEach((trade) => {
      const profit = Number(trade.profitLoss ?? 0)
      totalProfit += profit

      const isWin = trade.winLoss === "WIN" || profit > 0
      const isLoss = trade.winLoss === "LOSS" || profit < 0

      if (isWin) {
        winCount++
        grossProfit += profit
        currentStreak = currentStreak > 0 ? currentStreak + 1 : 1
        longestWinStreak = Math.max(longestWinStreak, currentStreak)
      } else if (isLoss) {
        lossCount++
        grossLoss -= profit
        currentStreak = currentStreak < 0 ? currentStreak - 1 : -1
        longestLoseStreak = Math.max(longestLoseStreak, Math.abs(currentStreak))
      }

      if (totalProfit > peak) {
        peak = totalProfit
      } else {
        const drawdown = peak - totalProfit
        if (drawdown > maxDrawdown) maxDrawdown = drawdown
      }

      // Profit by symbol
      profitBySymbol[trade.symbol] = (profitBySymbol[trade.symbol] || 0) + profit

      // Trades by day
      const tradeDate = new Date(trade.date).toISOString().split("T")[0]
      tradesByDay[tradeDate] = (tradesByDay[tradeDate] || 0) + 1
    })

    const totalTrades = winCount + lossCount
    const winRate = totalTrades > 0 ? winCount / totalTrades : 0
    const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? Infinity : 0

    return {
      totalProfit,
      winRate,
      maxDrawdown,
      longestWinStreak,
      longestLoseStreak,
      profitFactor: isFinite(profitFactor) ? profitFactor.toFixed(2) : "∞",
      profitBySymbol,
      tradesByDay,
      totalTrades: filteredTrades.length,
      averageProfit: filteredTrades.length > 0 ? totalProfit / filteredTrades.length : 0,
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

    return trades.filter((trade) => period === "all" || new Date(trade.date) >= periodStart)
  }

  const filteredTrades = filterTrades(timeframe)
  const stats = calculateStatistics(filteredTrades)

  const profitBySymbolData = Object.entries(stats.profitBySymbol).map(([symbol, profit]) => ({ symbol, profit }))
  const tradesByDayData = Object.entries(stats.tradesByDay).map(([date, count]) => ({ date, count }))

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Trade Statistics</h2>
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
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Profit</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">${stats.totalProfit.toFixed(2)}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Win Rate</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{(stats.winRate * 100).toFixed(2)}%</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Max Drawdown</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">${stats.maxDrawdown.toFixed(2)}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Profit Factor</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats.profitFactor}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Trades</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats.totalTrades}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Avg Profit/Trade</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">${stats.averageProfit.toFixed(2)}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Longest Win Streak</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats.longestWinStreak}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Longest Loss Streak</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats.longestLoseStreak}</div></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Profit by Symbol</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={profitBySymbolData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="symbol" fontSize={11} />
                  <YAxis fontSize={11} tickFormatter={(v: number) => `$${v}`} />
                  <Tooltip contentStyle={{ backgroundColor: '#1c1c1c', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="profit" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Trades per Day</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={tradesByDayData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="date" fontSize={11} />
                  <YAxis fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#1c1c1c', borderRadius: '8px' }} />
                  <Area type="step" dataKey="count" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
