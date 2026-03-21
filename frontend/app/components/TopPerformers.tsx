"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { getTrades } from "../lib/trades"

export default function TopPerformers() {
  const [grouped, setGrouped] = useState<Record<string, any[]>>({})

  useEffect(() => {
    getTrades().then((trades) => {
      const groups: Record<string, any[]> = {}
      trades.forEach((trade: any) => {
        const type = trade.tradeType || "other"
        if (!groups[type]) groups[type] = []
        groups[type].push(trade)
      })
      Object.keys(groups).forEach((type) => {
        groups[type] = groups[type]
          .filter((t) => t.profitLoss != null)
          .sort((a, b) => Number(b.profitLoss) - Number(a.profitLoss))
          .slice(0, 5)
      })
      setGrouped(groups)
    }).catch(console.error)
  }, [])

  if (Object.keys(grouped).length === 0) {
    return <p className="text-muted-foreground text-center py-8">No trade data available yet.</p>
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {Object.entries(grouped).map(([type, performers]) => (
        <Card key={type}>
          <CardHeader>
            <CardTitle className="capitalize">{type} Top Performers</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>P/L</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {performers.map((trade) => (
                  <TableRow key={trade.id}>
                    <TableCell className="font-medium">{trade.symbol}</TableCell>
                    <TableCell className={Number(trade.profitLoss) >= 0 ? "text-green-500" : "text-red-500"}>
                      ${Number(trade.profitLoss).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={Number(trade.profitLoss) >= 0 ? "default" : "destructive"}>
                        {Number(trade.profitLoss) >= 0 ? "Profit" : "Loss"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}