// app/dashboard/strategies/[strategyId]/page.tsx
// NO "use client" directive here. This is a Server Component.

import { StrategyJournalTabs } from "./StrategyJournalTabsClient"; // Import the Client Component

// --- Type Definitions (Ideally, these would come from @/types/*) ---
// These types are used by the Server Component for data fetching and props.
interface StrategyDetails {
  id: string;
  name: string;
  description: string;
  assetClasses: string[];
  indicatorsUsed: string;
  timeframes: string;
  entryRules: string;
  exitRules: string;
  riskManagement: string;
}

interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  mood?: string;
  lessons?: string;
}

// --- Mock Data Fetching Functions (Replace with actual lib/strategies calls) ---
// These functions simulate fetching data from a backend or database.
// In a real app, these would be in `lib/strategies.ts` and interact with your data source.

async function getStrategyByIdMock(id: string): Promise<StrategyDetails | null> {
  console.log(`SERVER: Fetching strategy details for ID: ${id}`);
  // Simulate network delay and data fetching
  await new Promise(resolve => setTimeout(resolve, 50));
  if (id === "notfound") return null; // Simulate a strategy not being found
  return {
    id: id,
    name: `Dynamic Strategy ${id}: Breakout Master`,
    description: `Detailed plan for trading breakouts on ${id === "1" ? "NASDAQ" : "Crypto"} futures.`,
    assetClasses: id === "1" ? ["Stocks", "Indices"] : ["Cryptocurrency"],
    indicatorsUsed: "Volume Profile, VWAP, 20 EMA",
    timeframes: "15min, 1H",
    entryRules: "Enter on confirmed breakout above key resistance with high volume.",
    exitRules: "SL below breakout candle, TP at 2R or next major resistance.",
    riskManagement: "Max 1% portfolio risk per trade. No more than 2 open trades for this strategy.",
  };
}

async function getJournalEntriesForStrategyMock(strategyId: string): Promise<JournalEntry[]> {
  console.log(`SERVER: Fetching journal entries for strategy ID: ${strategyId}`);
  await new Promise(resolve => setTimeout(resolve, 50));
  if (strategyId === "1") {
    return [
      { id: "j1", date: "2024-07-20", title: "Excellent QQQ Breakout", content: "Perfect entry, hit 2.5R. Volume confirmed the move.", mood: "Focused", lessons: "Trust the setup when all confluences align." },
      { id: "j2", date: "2024-07-19", title: "Choppy AAPL, Small Win", content: "Market was indecisive, took small profits. Avoided bigger loss.", mood: "Neutral", lessons: "Not every day is a home run day." },
    ];
  }
  return []; // Default to no entries for other strategies
}

async function getStrategyNotesMock(strategyId: string): Promise<string> {
  console.log(`SERVER: Fetching notes for strategy ID: ${strategyId}`);
  await new Promise(resolve => setTimeout(resolve, 50));
  return `These are the initial server-fetched notes for strategy ${strategyId}. Backtesting results show promise in trending markets. Consider adding a filter for market regime.`;
}

/**
 * StrategyDetailPage (Server Component)
 *
 * This page component fetches data for a specific strategy on the server
 * and then passes this data to the <StrategyJournalTabs /> client component
 * for interactive display and modification.
 */
export default async function StrategyDetailPage({ params }: { params: { strategyId: string } }) {
  const { strategyId } = params;

  // Fetch all necessary data concurrently for better performance
  const [strategy, journalEntries, notes] = await Promise.all([
    getStrategyByIdMock(strategyId),
    getJournalEntriesForStrategyMock(strategyId),
    getStrategyNotesMock(strategyId),
  ]);

  // Handle case where strategy is not found
  if (!strategy) {
    // In a real app, you might use Next.js's `notFound()` function here
    // import { notFound } from 'next/navigation';
    // notFound();
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold text-destructive">Strategy Not Found</h1>
        <p className="text-muted-foreground">The strategy with ID "{strategyId}" could not be found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Display strategy name and description from server-fetched data */}
      <div>
        <h1 className="text-3xl font-bold">{strategy.name}</h1>
        <p className="text-muted-foreground">{strategy.description}</p>
      </div>

      {/* Render the Client Component, passing all fetched data as props */}
      <StrategyJournalTabs
        strategyDetails={strategy}
        initialJournalEntries={journalEntries}
        initialNotes={notes}
        strategyId={strategyId} // Pass strategyId for client-side API calls
      />
    </div>
  );
}