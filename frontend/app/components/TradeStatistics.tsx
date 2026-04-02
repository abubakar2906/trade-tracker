"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts"
import type { Trade } from "../types/trade"

interface TradeStatisticsProps {
  trades: Trade[]
}

export default function TradeStatistics({ trades }: TradeStatisticsProps) {
  const [timeframe, setTimeframe] = useState("all")
  const [tradeType, setTradeType] = useState("all")

  const calculateStatistics = (filteredTrades: Trade[]) => {
    let totalProfit = 0
    let winCount = 0
    let lossCount = 0
    let maxDrawdown = 0
    let peak = 0
    let longestWinStreak = 0
    let longestLoseStreak = 0
    let currentStreak = 0
    let totalPips = 0
    let profitFactor = 0
    let grossProfit = 0
    let grossLoss = 0

    const profitBySymbol: { [key: string]: number } = {}
    const tradesByDay: { [key: string]: number } = {}

    filteredTrades.forEach((trade, index) => {
      const profit = trade.profitLoss !== null && trade.profitLoss !== undefined
        ? Number(trade.profitLoss)
        : (Number(trade.exitPrice) - Number(trade.entryPrice)) *
          Number(trade.quantity) *
          (trade.action === "buy" ? 1 : -1)
      totalProfit += profit

      if (profit > 0) {
        winCount++
        grossProfit += profit
        currentStreak = currentStreak > 0 ? currentStreak + 1 : 1
        longestWinStreak = Math.max(longestWinStreak, currentStreak)
      } else {
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

      // Calculate pips for forex trades
      if (trade.tradeType === "forex" && trade.exitPrice) {
        const pipValue = trade.symbol.includes("JPY") ? 0.01 : 0.0001
        totalPips += Math.abs(Number(trade.exitPrice) - Number(trade.entryPrice)) / pipValue
      }

      // Profit by symbol
      profitBySymbol[trade.symbol] = (profitBySymbol[trade.symbol] || 0) + profit

      // Trades by day
      const tradeDate = new Date(trade.entryDate).toISOString().split("T")[0]
      tradesByDay[tradeDate] = (tradesByDay[tradeDate] || 0) + 1
    })

    const totalTrades = winCount + lossCount
    const winRate = totalTrades > 0 ? winCount / totalTrades : 0
    profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? Infinity : 0

    return {
      totalProfit,
      winRate,
      maxDrawdown,
      longestWinStreak,
      longestLoseStreak,
      totalPips: totalPips.toFixed(1),
      profitFactor: isFinite(profitFactor) ? profitFactor.toFixed(2) : "∞",
      profitBySymbol,
      tradesByDay,
      totalTrades: filteredTrades.length,
      averageProfit: filteredTrades.length > 0 ? totalProfit / filteredTrades.length : 0,
    }
  }

  const filterTrades = (period: string, type: string) => {
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
      default:
      // Do nothing for "all" timeframe
    }

    return trades.filter(
      (trade) => (period === "all" || new Date(trade.entryDate) >= periodStart) && (type === "all" || trade.tradeType=== type),
    )
  }

  const filteredTrades = filterTrades(timeframe, tradeType)
  const stats = calculateStatistics(filteredTrades)

  const profitBySymbolData = Object.entries(stats.profitBySymbol).map(([symbol, profit]) => ({ symbol, profit }))
  const tradesByDayData = Object.entries(stats.tradesByDay).map(([date, count]) => ({ date, count }))

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Trade Statistics</h2>
        <div className="flex space-x-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="year">Past Year</SelectItem>
              <SelectItem value="month">Past Month</SelectItem>
              <SelectItem value="week">Past Week</SelectItem>
            </SelectContent>
          </Select>
          <Select value={tradeType} onValueChange={setTradeType}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Trade Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="forex">Forex</SelectItem>
              <SelectItem value="crypto">Crypto</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalProfit.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(stats.winRate * 100).toFixed(2)}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Max Drawdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.maxDrawdown.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Factor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.profitFactor}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTrades}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.averageProfit.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Longest Win Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.longestWinStreak}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Longest Lose Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.longestLoseStreak}</div>
          </CardContent>
        </Card>
      </div>
      {tradeType === "forex" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPips}</div>
          </CardContent>
        </Card>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Profit by Symbol</CardTitle>
          <CardDescription>Total profit for each traded symbol</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={profitBySymbolData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorProfitSymbol" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                <XAxis dataKey="symbol" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} tickMargin={10} />
                <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val: number) => `$${val}`} tickMargin={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1c1c1c', borderRadius: '8px', border: '1px solid #333', color: '#f3f4f6', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Profit']}
                />
                <Area type="monotone" dataKey="profit" stroke="#10b981" fillOpacity={1} fill="url(#colorProfitSymbol)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Trades by Day</CardTitle>
          <CardDescription>Number of trades executed each day</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={tradesByDayData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTradesDay" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                <XAxis dataKey="date" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} tickMargin={10} />
                <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} tickMargin={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1c1c1c', borderRadius: '8px', border: '1px solid #333', color: '#f3f4f6', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="count" stroke="#3b82f6" fillOpacity={1} fill="url(#colorTradesDay)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

