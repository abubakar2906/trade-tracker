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
  const [tradeType, setTradeType] = useState("all")

  // Helper function to calculate metrics
  const calculateMetrics = (filteredTrades: Trade[]) => {
    let totalProfit = 0
    let winCount = 0
    let lossCount = 0
    let maxDrawdown = 0
    let peak = 0
    const returns: number[] = []
    let pips = 0

    filteredTrades.forEach((trade, index) => {
      const profit =
        (Number(trade.exitPrice) - Number(trade.entryPrice)) *
        Number(trade.quantity) *
        (trade.action === "buy" ? 1 : -1)
      totalProfit += profit

      if (profit > 0) winCount++
      else lossCount++

      if (totalProfit > peak) {
        peak = totalProfit
      } else {
        const drawdown = peak - totalProfit
        if (drawdown > maxDrawdown) maxDrawdown = drawdown
      }

      if (index > 0) {
        const prevTotalProfit = filteredTrades
          .slice(0, index)
          .reduce(
            (sum, t) =>
              sum + (Number(t.exitPrice) - Number(t.entryPrice)) * Number(t.quantity) * (t.action === "buy" ? 1 : -1),
            0,
          )
        returns.push((totalProfit - prevTotalProfit) / prevTotalProfit)
      }

      // Calculate pips for forex trades
      if (trade.type === "forex") {
        const pipValue = trade.symbol.includes("JPY") ? 0.01 : 0.0001
        pips += Math.abs(Number(trade.exitPrice) - Number(trade.entryPrice)) / pipValue
      }
    })

    const winRate = winCount / (winCount + lossCount)
    const averageReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length
    const stdDeviation = Math.sqrt(returns.reduce((sum, r) => sum + Math.pow(r - averageReturn, 2), 0) / returns.length)
    const sharpeRatio = (averageReturn / stdDeviation) * Math.sqrt(252) // Annualized Sharpe Ratio

    return {
      totalProfit,
      winRate,
      maxDrawdown,
      sharpeRatio,
      pips: pips.toFixed(1),
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
      (trade) => (period === "all" || new Date(trade.date) >= periodStart) && (type === "all" || trade.type === type),
    )
  }

  const filteredTrades = filterTrades(timeframe, tradeType)
  const metrics = calculateMetrics(filteredTrades)

  const chartData = filteredTrades.map((trade, index) => ({
    tradeNumber: index + 1,
    profit:
      (Number(trade.exitPrice) - Number(trade.entryPrice)) * Number(trade.quantity) * (trade.action === "buy" ? 1 : -1),
  }))

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Trade Analysis</h2>
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
            <div className="text-2xl font-bold">${metrics.totalProfit.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(metrics.winRate * 100).toFixed(2)}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Max Drawdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.maxDrawdown.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sharpe Ratio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.sharpeRatio.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>
      {tradeType === "forex" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.pips}</div>
          </CardContent>
        </Card>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Profit/Loss Over Time</CardTitle>
          <CardDescription>Cumulative profit/loss for each trade</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="tradeNumber" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="profit" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

