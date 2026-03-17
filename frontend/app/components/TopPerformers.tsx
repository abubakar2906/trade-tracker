import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface TopPerformer {
  symbol: string
  profitLoss: number
  percentageChange: number
}

interface TopPerformersData {
  crypto: TopPerformer[]
  forex: TopPerformer[]
  stock: TopPerformer[]
  commodity: TopPerformer[]
}

const topPerformersData: TopPerformersData = {
  crypto: [
    { symbol: "BTC/USD", profitLoss: 5230.45, percentageChange: 12.5 },
    { symbol: "ETH/USD", profitLoss: 320.18, percentageChange: 8.7 },
    { symbol: "ADA/USD", profitLoss: 0.15, percentageChange: 7.2 },
    { symbol: "DOT/USD", profitLoss: 2.34, percentageChange: 6.8 },
    { symbol: "XRP/USD", profitLoss: 0.08, percentageChange: 5.9 },
  ],
  forex: [
    { symbol: "EUR/USD", profitLoss: 0.0234, percentageChange: 2.1 },
    { symbol: "GBP/JPY", profitLoss: 3.56, percentageChange: 1.8 },
    { symbol: "AUD/CAD", profitLoss: 0.0178, percentageChange: 1.6 },
    { symbol: "USD/CHF", profitLoss: 0.0156, percentageChange: 1.5 },
    { symbol: "NZD/USD", profitLoss: 0.0134, percentageChange: 1.3 },
  ],
  stock: [
    { symbol: "AAPL", profitLoss: 12.45, percentageChange: 6.8 },
    { symbol: "TSLA", profitLoss: 28.67, percentageChange: 5.9 },
    { symbol: "MSFT", profitLoss: 8.23, percentageChange: 3.2 },
    { symbol: "AMZN", profitLoss: 52.34, percentageChange: 2.7 },
    { symbol: "GOOGL", profitLoss: 43.21, percentageChange: 2.1 },
  ],
  commodity: [
    { symbol: "GOLD", profitLoss: 42.56, percentageChange: 2.3 },
    { symbol: "SILVER", profitLoss: 0.85, percentageChange: 3.1 },
    { symbol: "CRUDE OIL", profitLoss: 2.34, percentageChange: 3.8 },
    { symbol: "NAT GAS", profitLoss: 0.12, percentageChange: 4.2 },
    { symbol: "COPPER", profitLoss: 0.15, percentageChange: 3.5 },
  ],
}

export default function TopPerformers() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {(Object.keys(topPerformersData) as Array<keyof typeof topPerformersData>).map((type) => (
        <Card key={type} className="w-full">
          <CardHeader>
            <CardTitle className="capitalize">{type} Top Performers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Profit/Loss</TableHead>
                    <TableHead>% Change</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topPerformersData[type].map((performer) => (
                    <TableRow key={performer.symbol}>
                      <TableCell className="font-medium">{performer.symbol}</TableCell>
                      <TableCell className={performer.profitLoss > 0 ? "text-green-500" : "text-red-500"}>
                        {type === "forex" ? performer.profitLoss.toFixed(4) : performer.profitLoss.toFixed(2)}
                      </TableCell>
                      <TableCell className={performer.percentageChange > 0 ? "text-green-500" : "text-red-500"}>
                        {performer.percentageChange.toFixed(2)}%
                      </TableCell>
                      <TableCell>
                        <Badge variant={performer.profitLoss > 0 ? "success" : "destructive"}>
                          {performer.profitLoss > 0 ? "Profit" : "Loss"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

