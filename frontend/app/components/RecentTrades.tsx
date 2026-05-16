"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { getTrades } from "../lib/trades"
import type { Trade } from "../types/trade"

export default function RecentTrades() {
  const [trades, setTrades] = useState<Trade[]>([])

  useEffect(() => {
    getTrades().then(setTrades).catch(console.error)
  }, [])

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Symbol</TableHead>
          <TableHead>Bias</TableHead>
          <TableHead>Setups</TableHead>
          <TableHead>P/L</TableHead>
          <TableHead>Result</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {trades.slice(0, 5).map((trade) => (
          <TableRow key={trade.id}>
            <TableCell>{new Date(trade.date).toLocaleDateString()}</TableCell>
            <TableCell className="font-medium">{trade.symbol}</TableCell>
            <TableCell>
              <Badge variant="outline">{trade.bias}</Badge>
            </TableCell>
            <TableCell>
              {trade.setups?.length ? (
                <div className="flex gap-1 flex-wrap">
                  {trade.setups.slice(0, 2).map((s) => <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>)}
                  {trade.setups.length > 2 && <span className="text-[10px] text-muted-foreground">+{trade.setups.length - 2}</span>}
                </div>
              ) : "—"}
            </TableCell>
            <TableCell className={trade.profitLoss && trade.profitLoss >= 0 ? "text-green-500 font-medium" : trade.profitLoss && trade.profitLoss < 0 ? "text-red-500 font-medium" : ""}>
              {trade.profitLoss != null ? `${trade.profitLoss >= 0 ? "+" : ""}$${Math.abs(trade.profitLoss).toFixed(2)}` : "—"}
            </TableCell>
            <TableCell>
              <Badge variant={trade.winLoss === "WIN" ? "default" : trade.winLoss === "LOSS" ? "destructive" : "secondary"}>
                {trade.winLoss || "PENDING"}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
        {trades.length === 0 && (
          <TableRow>
            <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
              No trades logged yet
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}