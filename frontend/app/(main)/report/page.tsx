"use client"

import { useEffect, useState } from "react"
import TradeStatistics from "../../components/TradeStatistics"
import InsightCards from "../../components/InsightCards"
import { getTrades } from "../../lib/trades"

export default function ReportPage() {
  const [trades, setTrades] = useState<any[]>([])

  useEffect(() => {
    getTrades().then(setTrades).catch(console.error)
  }, [])

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Trade Report</h1>
      <InsightCards />
      <TradeStatistics trades={trades} />
    </div>
  )
}