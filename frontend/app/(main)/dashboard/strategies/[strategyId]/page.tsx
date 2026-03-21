"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { StrategyJournalTabs } from "./StrategyJournalTabsClient"
import { apiFetch } from "../../../../lib/api"

export default function StrategyDetailPage() {
  const { strategyId } = useParams() as { strategyId: string }
  const [strategy, setStrategy] = useState<any>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    apiFetch(`/api/strategies`)
      .then((strategies: any[]) => {
        const found = strategies.find((s) => s.id === strategyId)
        if (!found) setNotFound(true)
        else setStrategy(found)
      })
      .catch(() => setNotFound(true))
  }, [strategyId])

  if (notFound) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold text-destructive">Strategy Not Found</h1>
        <p className="text-muted-foreground">The strategy with ID "{strategyId}" could not be found.</p>
      </div>
    )
  }

  if (!strategy) {
    return <div className="p-4 text-muted-foreground">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{strategy.name}</h1>
        <p className="text-muted-foreground">{strategy.description}</p>
      </div>
      <StrategyJournalTabs
        strategyDetails={strategy}
        initialJournalEntries={strategy.journalEntries ?? []}
        initialNotes={strategy.notes ?? ""}
        strategyId={strategyId}
      />
    </div>
  )
}