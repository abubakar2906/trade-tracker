"use client"

import { useTheme } from "next-themes"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import type { Trade } from "../types/trade"

interface TradeChartProps {
  trades: Trade[]
  type: "forex" | "crypto"
}

// Bug 5 fix: unique gradient IDs per chart type
// Bug 6 fix: light theme now has correct "forex" key
// S1 simplification: single renderChart() instead of duplicated branches
const chartColors: Record<"forex" | "crypto", { dark: string; light: string }> = {
  forex: { dark: "#4CAF50", light: "#2E7D32" },
  crypto: { dark: "#F7931A", light: "#FF6B00" },
}

export default function TradeChart({ trades, type }: TradeChartProps) {
  const { theme } = useTheme()

  const color = theme === "dark" ? chartColors[type].dark : chartColors[type].light
  const gradientId = `colorProfit-${type}`

  const data = trades
    .filter((trade) => trade.tradeType === type)
    .map((trade) => ({
      symbol: trade.symbol,
      profit: Number.parseFloat(
        (
          (Number.parseFloat(String(trade.exitPrice ?? "0")) - Number.parseFloat(String(trade.entryPrice ?? "0"))) *
          Number.parseFloat(String(trade.quantity ?? "0")) *
          (trade.action === "buy" ? 1 : -1)
        ).toFixed(2),
      ),
      action: trade.action,
      date: new Date(trade.entryDate).getTime(),
    }))
    .sort((a, b) => a.date - b.date)

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.8} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
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
          formatter={(value: number | string) => {
            const numValue = typeof value === 'number' ? value : 0
            return `${numValue} `
          }}
          labelFormatter={(label: string) => `${label}`}
        />
        <Area
          type="monotone"
          dataKey="profit"
          stroke={color}
          fillOpacity={1}
          fill={`url(#${gradientId})`}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
