"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { NewsWidget } from "../../components/NewsWidget"
import { BarChart2, PieChart, TrendingUp, DollarSign } from "lucide-react"
import RecentTrades from "../../components/RecentTrades"
import InsightCards from "../../components/InsightCards"
import { getTrades } from "../../lib/trades"

export default function Dashboard() {
  const [trades, setTrades] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalTrades: 0,
    winRate: 0,
    profitFactor: 0,
    totalProfit: 0,
  })

  useEffect(() => {
    getTrades().then((fetchedTrades: any[]) => {
      setTrades(fetchedTrades)
      const totalTrades = fetchedTrades.length
      let wins = 0
      let grossProfit = 0
      let grossLoss = 0
      let totalProfit = 0

      fetchedTrades.forEach((trade) => {
        const pl = Number(trade.profitLoss ?? 0)
        totalProfit += pl
        if (pl > 0) {
          wins++
          grossProfit += pl
        } else {
          grossLoss += Math.abs(pl)
        }
      })

      const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0
      const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? Infinity : 0

      setStats({
        totalTrades,
        winRate,
        profitFactor,
        totalProfit,
      })
    }).catch(console.error)
  }, [])

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTrades}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.winRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Factor</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isFinite(stats.profitFactor) ? stats.profitFactor.toFixed(2) : "∞"}
            </div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.totalProfit >= 0 ? "text-green-500" : "text-red-500"}`}>
              ${stats.totalProfit.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <InsightCards compact />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Trades</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentTrades initialTrades={trades} />
          </CardContent>
        </Card>
        
        <div className="col-span-1">
          <NewsWidget />
        </div>
      </div>
      <div className="flex justify-end space-x-4">
        <Button asChild>
          <Link href="/dashboard/trades">View All Trades</Link>
        </Button>
      </div>
    </div>
  )
}