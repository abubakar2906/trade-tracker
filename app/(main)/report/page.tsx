import { getTrades } from "../../lib/trades"
import TradeStatistics from "../../components/TradeStatistics"
import AITradeAnalysis from "../../components/AITradeAnalysis"

export default async function ReportPage() {
  const trades = await getTrades()

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Trade Report</h1>
      <TradeStatistics trades={trades} />
    </div>
  )
}

