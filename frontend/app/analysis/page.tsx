import AIAnalysis from "../components/AIAnalysis"
import { getTrades } from "../lib/trades"

export default async function AnalysisPage() {
  const trades = await getTrades()

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">AI Analysis</h1>
      <AIAnalysis trades={trades} />
    </div>
  )
}

