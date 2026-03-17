// app/dashboard/strategies/page.tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Edit3, BookOpen } from "lucide-react"
// TODO: Define StrategyType and fetch strategies
// import { StrategyType } from "@/types/strategy";
// import { getStrategies } from "@/lib/strategies";

// Mock data for now
const mockStrategies = [
  { id: "1", name: "Mean Reversion Scalp", description: "Scalping strategy based on short-term mean reversion on 5-min chart.", tradesCount: 15, lastJournalEntry: "2024-07-15" },
  { id: "2", name: "Breakout Momentum", description: "Trading breakouts on high volume for momentum continuation.", tradesCount: 8, lastJournalEntry: "2024-07-10" },
];

export default async function StrategiesPage() {
  // const strategies: StrategyType[] = await getStrategies(); // TODO: Implement this
  const strategies = mockStrategies; // Using mock for now

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
              You haven't created any strategies yet.
              <Link href="/dashboard/strategies/new" className="text-primary underline ml-1">
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
                <p className="text-sm text-muted-foreground">Trades Logged: {strategy.tradesCount}</p>
                <p className="text-sm text-muted-foreground">Last Journal: {strategy.lastJournalEntry || "N/A"}</p>
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