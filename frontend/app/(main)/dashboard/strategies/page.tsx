"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Edit3, BookOpen } from "lucide-react"
import { apiFetch } from "../../../lib/api"

export default function StrategiesPage() {
  const [strategies, setStrategies] = useState<any[]>([])

  useEffect(() => {
    apiFetch("/api/strategies").then(setStrategies).catch(console.error)
  }, [])

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Trading Strategies</h1>
        <Button asChild>
          <Link href="/dashboard/strategies/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Strategy
          </Link>
        </Button>
      </div>

      {strategies.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              You haven't created any strategies yet.{" "}
              <Link href="/dashboard/strategies/new" className="text-primary underline">
                Create your first one!
              </Link>
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {strategies.map((strategy) => (
            <Card key={strategy.id}>
              <CardHeader>
                <CardTitle>{strategy.name}</CardTitle>
                <CardDescription className="h-12 overflow-hidden text-ellipsis">
                  {strategy.description || "No description provided."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Trades Logged: {strategy.journalEntries?.length ?? 0}
                </p>
                <p className="text-sm text-muted-foreground">
                  Last Journal:{" "}
                  {strategy.journalEntries?.length > 0
                    ? new Date(strategy.journalEntries[0].date).toLocaleDateString()
                    : "N/A"}
                </p>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/strategies/${strategy.id}/edit`}>
                    <Edit3 className="mr-2 h-4 w-4" /> Edit
                  </Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href={`/dashboard/strategies/${strategy.id}`}>
                    <BookOpen className="mr-2 h-4 w-4" /> View & Journal
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}