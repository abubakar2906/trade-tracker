"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { getTrades } from "../lib/trades"

export default function RecentTrades() {
  const [trades, setTrades] = useState<any[]>([])

  useEffect(() => {
    getTrades().then(setTrades).catch(console.error)
  }, [])

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Symbol</TableHead>
          <TableHead>Entry Price</TableHead>
          <TableHead>Exit Price</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>P/L</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {trades.slice(0, 5).map((trade) => (
          <TableRow key={trade.id}>
            <TableCell className="font-medium">{trade.symbol}</TableCell>
            <TableCell>${Number(trade.entryPrice).toFixed(2)}</TableCell>
            <TableCell>{trade.exitPrice ? `$${Number(trade.exitPrice).toFixed(2)}` : "—"}</TableCell>
            <TableCell>{trade.quantity}</TableCell>
            <TableCell className={Number(trade.profitLoss) >= 0 ? "text-green-500" : "text-red-500"}>
              {trade.profitLoss != null ? `$${Number(trade.profitLoss).toFixed(2)}` : "—"}
            </TableCell>
            <TableCell>
              <Badge variant={trade.status === "open" ? "secondary" : Number(trade.profitLoss) >= 0 ? "default" : "destructive"}>
                {trade.status === "open" ? "Open" : Number(trade.profitLoss) >= 0 ? "Profit" : "Loss"}
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