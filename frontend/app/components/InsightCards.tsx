"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { apiFetch } from "@/app/lib/api"
import { Brain, TrendingUp, Heart, Target, ShieldAlert, Newspaper, Info, AlertTriangle, Zap, RefreshCw, Loader2, MessageCircle } from "lucide-react"

export interface Insight {
  id: string
  type: "PERFORMANCE" | "EMOTIONAL" | "STRATEGY" | "RISK" | "MARKET"
  severity: "INFO" | "WARNING" | "CRITICAL"
  title: string
  finding: string
  recommendation: string
  createdAt: string
}

interface AIStatus {
  ready: boolean
  tradeCount: number
  required: number
  lastGenerated: string | null
}

interface InsightCardsProps {
  onAskAbout?: (insight: Insight) => void
  compact?: boolean
  vertical?: boolean // forces single-column layout regardless of screen width
}

const TYPE_CONFIG = {
  PERFORMANCE: { icon: TrendingUp,  label: "Performance", color: "text-blue-400",    bg: "bg-blue-400/10",    border: "border-blue-400/20" },
  EMOTIONAL:   { icon: Heart,       label: "Emotional",   color: "text-pink-400",    bg: "bg-pink-400/10",    border: "border-pink-400/20" },
  STRATEGY:    { icon: Target,      label: "Strategy",    color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20" },
  RISK:        { icon: ShieldAlert, label: "Risk",        color: "text-orange-400",  bg: "bg-orange-400/10",  border: "border-orange-400/20" },
  MARKET:      { icon: Newspaper,   label: "Market",      color: "text-purple-400",  bg: "bg-purple-400/10",  border: "border-purple-400/20" },
}

const SEVERITY_CONFIG = {
  INFO:     { icon: Info,          color: "text-blue-400",   bg: "bg-blue-400/10" },
  WARNING:  { icon: AlertTriangle, color: "text-yellow-400", bg: "bg-yellow-400/10" },
  CRITICAL: { icon: Zap,           color: "text-red-400",    bg: "bg-red-400/10" },
}

export default function InsightCards({ onAskAbout, compact = false, vertical = false }: InsightCardsProps) {
  const [insights, setInsights] = useState<Insight[]>([])
  const [status, setStatus] = useState<AIStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState("")
  const hasFetched = useRef(false)

  useEffect(() => {
    // Only run once per mount — prevent double-fetch in React StrictMode
    if (hasFetched.current) return
    hasFetched.current = true
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    setError("")

    try {
      // Single endpoint — both insights and status in one call
      const data = await apiFetch("/api/ai/data")
      const { insights: fetchedInsights, status: fetchedStatus } = data

      setStatus(fetchedStatus)

      if (fetchedInsights && fetchedInsights.length > 0) {
        // ✅ Insights exist — show them immediately, no generation needed
        setInsights(fetchedInsights)
      } else if (fetchedStatus?.ready) {
        // No insights yet but enough trades — auto-generate once
        await autoGenerate(fetchedStatus)
      } else {
        // Not enough trades — show progress
        setInsights([])
      }
    } catch (err: any) {
      // DB timeout or network error — don't clear existing insights
      console.error("Failed to load AI data:", err)
      setError("Could not connect to server. Showing cached data if available.")
    } finally {
      setLoading(false)
    }
  }

  async function autoGenerate(currentStatus: AIStatus) {
    setGenerating(true)
    try {
      const result = await apiFetch("/api/ai/insights/generate", { method: "POST" })
      setInsights(result.insights || [])
      setStatus({ ...currentStatus, lastGenerated: new Date().toISOString() })
    } catch (err: any) {
      setError(err.message || "Auto-generation failed. Click Refresh to try again.")
      setInsights([])
    } finally {
      setGenerating(false)
    }
  }

  async function handleGenerate() {
    setGenerating(true)
    setError("")
    try {
      const result = await apiFetch("/api/ai/insights/generate", { method: "POST" })
      setInsights(result.insights || [])
      if (status) setStatus({ ...status, lastGenerated: new Date().toISOString() })
    } catch (err: any) {
      setError(err.message || "Failed to generate insights")
    } finally {
      setGenerating(false)
    }
  }

  // ── Loading skeleton ────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">AI Insights</h2>
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
        <div className={`grid grid-cols-1 ${vertical ? "" : compact ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3"} gap-4`}>
          {[...Array(compact ? 4 : 5)].map((_, i) => (
            <Card key={i} className="overflow-hidden animate-pulse">
              <div className="h-1 bg-muted" />
              <CardContent className="pt-4 pb-5 px-5 space-y-3">
                <div className="h-3 bg-muted rounded w-1/3" />
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-full" />
                <div className="h-3 bg-muted rounded w-5/6" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // ── Not enough trades ───────────────────────────────────────────────────────────

  if (status && !status.ready) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-3 mb-4">
            <Brain className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="font-semibold mb-1">AI Coach Needs More Data</h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            Log at least {status.required} trades to unlock personalized AI insights. You have {status.tradeCount} so far.
          </p>
          <div className="w-full max-w-xs mt-4">
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${Math.min((status.tradeCount / status.required) * 100, 100)}%` }} />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{status.tradeCount}/{status.required} trades</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const displayed = compact ? insights.slice(0, 4) : insights

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">AI Insights</h2>
          {status?.lastGenerated && (
            <span className="text-xs text-muted-foreground">
              Updated {new Date(status.lastGenerated).toLocaleDateString()}
            </span>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={handleGenerate} disabled={generating || loading} className="gap-1.5">
          {generating ? (<><Loader2 className="h-3.5 w-3.5 animate-spin" /> Analyzing...</>) : (<><RefreshCw className="h-3.5 w-3.5" /> Refresh</>)}
        </Button>
      </div>

      {error && (
        <div className="rounded-lg bg-yellow-500/10 border border-yellow-500/20 p-3">
          <p className="text-sm text-yellow-600 dark:text-yellow-400">{error}</p>
        </div>
      )}

      {generating && insights.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
          <h3 className="font-semibold">Analyzing your trading data...</h3>
          <p className="text-sm text-muted-foreground mt-1">This takes about 10 seconds</p>
        </div>
      ) : insights.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-10 text-center">
            <Brain className="h-8 w-8 text-muted-foreground mb-3" />
            <h3 className="font-semibold mb-1">No Insights Yet</h3>
            <p className="text-sm text-muted-foreground mb-4">Click "Refresh" to generate your first personalized analysis.</p>
            <Button onClick={handleGenerate} disabled={generating} size="sm">{generating ? "Analyzing..." : "Generate Insights"}</Button>
          </CardContent>
        </Card>
      ) : (
        <div className={`grid grid-cols-1 ${vertical ? "" : compact ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3"} gap-4`}>
          {displayed.map((insight) => {
            const typeConf = TYPE_CONFIG[insight.type] || TYPE_CONFIG.PERFORMANCE
            const sevConf = SEVERITY_CONFIG[insight.severity] || SEVERITY_CONFIG.INFO
            const TypeIcon = typeConf.icon

            return (
              <Card key={insight.id} className={`${typeConf.border} border overflow-hidden group hover:border-opacity-60 transition-all`}>
                <div className={`h-1 ${typeConf.bg.replace('/10', '/40')}`} />
                <CardContent className="pt-4 pb-5 px-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className={`rounded-md p-1.5 ${typeConf.bg}`}>
                        <TypeIcon className={`h-4 w-4 ${typeConf.color}`} />
                      </div>
                      <span className={`text-xs font-medium uppercase tracking-wider ${typeConf.color}`}>{typeConf.label}</span>
                    </div>
                    {insight.severity !== "INFO" && (
                      <div className={`rounded-full px-2 py-0.5 ${sevConf.bg}`}>
                        <span className={`text-xs font-medium ${sevConf.color}`}>{insight.severity}</span>
                      </div>
                    )}
                  </div>

                  <h3 className="font-semibold text-sm leading-tight">{insight.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{insight.finding}</p>
                  
                  <div className="rounded-lg bg-muted/50 p-3 border border-border">
                    <p className="text-sm font-medium leading-relaxed">→ {insight.recommendation}</p>
                  </div>

                  {onAskAbout && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full gap-1.5 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => onAskAbout(insight)}
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      Ask about this
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
