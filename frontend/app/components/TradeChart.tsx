"use client"

import { useTheme } from "next-themes"
import { Line, LineChart, Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import type { Trade } from "../types/trade"

interface TradeChartProps {
  trades: Trade[]
  type: "forex" | "crypto"
}

export default function TradeChart({ trades, type }: TradeChartProps) {
  const { theme } = useTheme()

  const data = trades
    .filter((trade) => trade.type === type)
    .map((trade) => ({
      symbol: trade.symbol,
      profit: Number.parseFloat(
        (
          (Number.parseFloat(trade.exitPrice) - Number.parseFloat(trade.entryPrice)) *
          Number.parseFloat(trade.quantity) *
          (trade.action === "buy" ? 1 : -1)
        ).toFixed(2),
      ),
      action: trade.action,
      date: new Date(trade.date).getTime(),
    }))
    .sort((a, b) => a.date - b.date)

  const chartColor =
    theme === "dark"
      ? {
          crypto: "#F7931A",
          forex: "#4CAF50",
        }
      : {
          crypto: "#FF6B00",
          stock: "#1976D2",
        }

  const renderChart = () => {
    switch (type) {
      case "forex":
        return (
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColor.crypto} stopOpacity={0.8} />
                <stop offset="95%" stopColor={chartColor.crypto} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="symbol" />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: theme === "dark" ? "#1F2937" : "#FFFFFF",
                color: theme === "dark" ? "#FFFFFF" : "#000000",
              }}
              formatter={(value, name, props) => [`${value} (${props.payload.action})`, name]}
            />
            <Area
              type="monotone"
              dataKey="profit"
              stroke={chartColor.crypto}
              fillOpacity={1}
              fill="url(#colorProfit)"
            />
          </AreaChart>
        )
      case "crypto":
        return (
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColor.crypto} stopOpacity={0.8} />
                <stop offset="95%" stopColor={chartColor.crypto} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="symbol" />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: theme === "dark" ? "#1F2937" : "#FFFFFF",
                color: theme === "dark" ? "#FFFFFF" : "#000000",
              }}
              formatter={(value, name, props) => [`${value} (${props.payload.action})`, name]}
            />
            <Area
              type="monotone"
              dataKey="profit"
              stroke={chartColor.crypto}
              fillOpacity={1}
              fill="url(#colorProfit)"
            />
          </AreaChart>
        )
      
    }
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      {renderChart()}
    </ResponsiveContainer>
  )
}

