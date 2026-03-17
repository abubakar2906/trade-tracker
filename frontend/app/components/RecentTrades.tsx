import { getTrades } from "../lib/trades"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default async function RecentTrades() {
  const trades = await getTrades()

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
            <TableCell>${Number.parseFloat(trade.entryPrice).toFixed(2)}</TableCell>
            <TableCell>${Number.parseFloat(trade.exitPrice).toFixed(2)}</TableCell>
            <TableCell>{trade.quantity}</TableCell>
            <TableCell className={trade.exitPrice > trade.entryPrice ? "text-green-500" : "text-red-500"}>
              ${((trade.exitPrice - trade.entryPrice) * trade.quantity).toFixed(2)}
            </TableCell>
            <TableCell>
              <Badge variant={trade.exitPrice > trade.entryPrice ? "success" : "destructive"}>
                {trade.exitPrice > trade.entryPrice ? "Profit" : "Loss"}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

