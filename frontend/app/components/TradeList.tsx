import { getTrades } from "../lib/trades"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import TradeChart from "./TradeChart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TradeListProps {
  showChartOnly?: boolean
  showTableOnly?: boolean
}

export default async function TradeList({ showChartOnly, showTableOnly }: TradeListProps) {
  const trades = await getTrades()

  const tradeTypes = ["crypto", "forex"] as const

  return (
    <div className="space-y-8">
      {!showTableOnly && (
        <Tabs defaultValue="forex" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            {tradeTypes.map((type) => (
              <TabsTrigger key={type} value={type} className="capitalize">
                {type}
              </TabsTrigger>
            ))}
          </TabsList>
          {tradeTypes.map((type) => (
            <TabsContent key={type} value={type} className="h-[400px]">
              <TradeChart trades={trades} type={type} />
            </TabsContent>
          ))}
        </Tabs>
      )}
      {!showChartOnly && (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead>Entry Price</TableHead>
                <TableHead>Exit Price</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>P/L</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trades.map((trade) => (
                <TableRow key={trade.id}>
                  <TableCell>{new Date(trade.date).toLocaleDateString()}</TableCell>
                  <TableCell className="capitalize">{trade.type}</TableCell>
                  <TableCell className="capitalize">{trade.action}</TableCell>
                  <TableCell className="font-medium">{trade.symbol}</TableCell>
                  <TableCell>${Number.parseFloat(trade.entryPrice).toFixed(4)}</TableCell>
                  <TableCell>${Number.parseFloat(trade.exitPrice).toFixed(4)}</TableCell>
                  <TableCell>{trade.quantity}</TableCell>
                  <TableCell
                    className={
                      Number.parseFloat(trade.exitPrice) > Number.parseFloat(trade.entryPrice)
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    $
                    {(
                      (Number.parseFloat(trade.exitPrice) - Number.parseFloat(trade.entryPrice)) *
                      Number.parseFloat(trade.quantity) *
                      (trade.action === "buy" ? 1 : -1)
                    ).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        (Number.parseFloat(trade.exitPrice) > Number.parseFloat(trade.entryPrice) &&
                          trade.action === "buy") ||
                        (Number.parseFloat(trade.exitPrice) < Number.parseFloat(trade.entryPrice) &&
                          trade.action === "sell")
                          ? "success"
                          : "destructive"
                      }
                    >
                      {(Number.parseFloat(trade.exitPrice) > Number.parseFloat(trade.entryPrice) &&
                        trade.action === "buy") ||
                      (Number.parseFloat(trade.exitPrice) < Number.parseFloat(trade.entryPrice) &&
                        trade.action === "sell")
                        ? "Profit"
                        : "Loss"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

