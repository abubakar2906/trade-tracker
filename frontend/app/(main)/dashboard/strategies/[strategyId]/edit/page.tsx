"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import StrategyForm from "@/components/ui/StrategyForm"
import { apiFetch } from "../../../../../lib/api"

export default function EditStrategyPage() {
  const { strategyId } = useParams() as { strategyId: string }
  const [strategy, setStrategy] = useState(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    apiFetch("/api/strategies")
      .then((strategies: any[]) => {
        const found = strategies.find((s) => s.id === strategyId)
        if (!found) setNotFound(true)
        else setStrategy(found)
      })
      .catch(() => setNotFound(true))
  }, [strategyId])

  if (notFound) {
    return (
      <div className="text-center p-4">
        <h1 className="text-2xl font-bold text-destructive">Strategy Not Found</h1>
      </div>
    )
  }

  if (!strategy) {
    return <div className="p-4 text-muted-foreground">Loading...</div>
  }

  return (
    <div className="space-y-8">
      <StrategyForm initialData={strategy} strategyId={strategyId} />
    </div>
  )
}