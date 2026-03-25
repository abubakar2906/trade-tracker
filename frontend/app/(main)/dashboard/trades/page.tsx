// app/(main)/dashboard/trades/page.tsx
// This is a Server Component

import TradeForm from "../../../components/TradeForm"; // Ensure path is correct
import TradeList from "../../../components/TradeList"; // Ensure path is correct
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Suspense } from "react";
import { ListChecks, LineChart, PlusCircle, Server } from "lucide-react";
import { BrokerConnections } from "../../../components/BrokerConnections";
import { CsvImport } from "../../../components/CsvImport";

/**
 * TradesPage Component
 *
 * Provides a user interface for logging new trades and viewing existing trades
 * and performance. Uses a tabbed layout for better organization.
 */
export default function TradesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Trade Journal</h1>
        {/* Optional: A quick action button or summary could go here */}
      </div>

      <Tabs defaultValue="brokerSync" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-4 gap-2 mb-6">
          <TabsTrigger value="brokerSync">
            <Server className="mr-2 h-4 w-4" /> Import & Sync
          </TabsTrigger>
          <TabsTrigger value="logTrade">
            <PlusCircle className="mr-2 h-4 w-4" /> Manual Log
          </TabsTrigger>
          <TabsTrigger value="tradeList">
            <ListChecks className="mr-2 h-4 w-4" /> All Trades
          </TabsTrigger>
          <TabsTrigger value="performance">
            <LineChart className="mr-2 h-4 w-4" /> Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="brokerSync" className="space-y-6">
          <CsvImport />
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground text-[10px] tracking-wider font-semibold">MT4/MT5 Integration</span>
            </div>
          </div>
          <div className="opacity-60 grayscale pointer-events-none select-none relative">
            <div className="absolute top-2 right-2 z-10">
              <Badge variant="secondary" className="bg-amber-500/10 text-amber-500 border-amber-500/20 px-2 py-0 text-[10px] uppercase font-bold tracking-widest leading-none h-5">
                Coming Soon
              </Badge>
            </div>
            <BrokerConnections />
          </div>
        </TabsContent>

        <TabsContent value="logTrade">
          <Card>
            <CardHeader>
              <CardTitle>Log a New Trade</CardTitle>
              {/* <CardDescription>Enter the details of your recent trade.</CardDescription> */}
            </CardHeader>
            <CardContent>
              <TradeForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tradeList">
          <Card>
            <CardHeader>
              <CardTitle>Trade History</CardTitle>
              {/* <CardDescription>A complete list of all your logged trades.</CardDescription> */}
            </CardHeader>
            <CardContent>
              <Suspense fallback={<LoadingSpinner message="Loading trade list..." />}>
                <TradeList showTableOnly={true} />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Trade Performance Overview</CardTitle>
              {/* <CardDescription>Visualize your trading performance over time.</CardDescription> */}
            </CardHeader>
            <CardContent className="min-h-[400px] lg:min-h-[500px]">
              <Suspense fallback={<LoadingSpinner message="Loading performance chart..." />}>
                <TradeList showChartOnly={true} />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Simple loading spinner component (can be in its own file)
function LoadingSpinner({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-muted-foreground">
      {/* You can use a proper spinner icon here */}
      <svg className="animate-spin h-8 w-8 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      {message}
    </div>
  );
}