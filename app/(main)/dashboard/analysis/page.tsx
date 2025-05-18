import AIAnalysis from "../../../components/AIAnalysis"
import TradeAnalysis from "../../../components/TradeAnalysis"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getTrades } from "../../../lib/trades"

export default async function AnalysisPage() {
  const trades = await getTrades()

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Trade Analysis</h1>
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quantitative Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <TradeAnalysis trades={trades} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>AI-Powered Trade Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <AIAnalysis trades={trades} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

