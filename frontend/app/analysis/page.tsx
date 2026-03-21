"use client"
import { useEffect, useState } from "react"
import TradeAnalysis from "../components/TradeAnalysis"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getTrades } from "../lib/trades"

export default function AnalysisPage() {
  const [trades, setTrades] = useState<any[]>([])

  useEffect(() => {
    getTrades().then(setTrades).catch(console.error)
  }, [])

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
      </div>
    </div>
  )
}