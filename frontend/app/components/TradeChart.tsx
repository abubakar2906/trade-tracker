"use client"

import { useTheme } from "next-themes"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import type { Trade } from "../types/trade"

interface TradeChartProps {
  trades: Trade[]
}

export default function TradeChart({ trades }: TradeChartProps) {
  const { theme } = useTheme()
  const color = "#3b82f6"

  const data = trades
    .map((trade) => ({
      symbol: trade.symbol,
      profit: Number.parseFloat(String(trade.profitLoss ?? "0")),
      date: new Date(trade.date).getTime(),
    }))
    .sort((a, b) => a.date - b.date)

  let running = 0;
  const cumulativeData = data.map(d => {
      running += d.profit;
      return { ...d, cumulative: running };
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={cumulativeData}>
        <defs>
          <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.8} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
        <XAxis dataKey="symbol" fontSize={11} tickLine={false} axisLine={false} tickMargin={10} />
        <YAxis fontSize={11} tickLine={false} axisLine={false} tickMargin={10} tickFormatter={(v: number) => `$${v}`} />
        <Tooltip
          contentStyle={{
            backgroundColor: theme === "dark" ? "#1F2937" : "#FFFFFF",
            color: theme === "dark" ? "#FFFFFF" : "#000000",
            borderRadius: "8px",
            border: "none",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
          }}
          formatter={(value: number) => [`$${value.toFixed(2)}`, 'Cumulative PnL']}
        />
        <Area
          type="monotone"
          dataKey="cumulative"
          stroke={color}
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorProfit)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
