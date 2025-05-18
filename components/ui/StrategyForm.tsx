// components/StrategyForm.tsx
"use client";

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
// TODO: Define StrategyType
// import { StrategyType } from "@/types/strategy"

interface StrategyFormProps {
  initialData?: any; // Replace 'any' with StrategyType
  strategyId?: string;
}

// Trader Insight: Key elements of a strategy definition
const defaultStrategy = {
  name: "",
  description: "",
  assetClasses: [], // e.g., ["Crypto", "Forex", "Stocks"]
  indicatorsUsed: "", // Comma-separated or structured
  timeframes: "", // e.g., "5min, 1H, Daily"
  entryRules: "",
  exitRules: "",
  riskManagement: "", // e.g., "1% risk per trade, max 3 open positions"
  notes: "", // General notes about the strategy
};

export default function StrategyForm({ initialData, strategyId }: StrategyFormProps) {
  const [strategy, setStrategy] = useState(initialData || defaultStrategy);
  const router = useRouter();
  const isEditing = !!strategyId;

  useEffect(() => {
    if (initialData) {
      setStrategy(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setStrategy((prev: any) => ({ ...prev, [name]: value }));
  };

  // TODO: Handle assetClasses (e.g., with checkboxes or multi-select)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API call to save/update strategy
    // const endpoint = isEditing ? `/api/strategies/${strategyId}` : "/api/strategies";
    // const method = isEditing ? "PUT" : "POST";
    // const response = await fetch(endpoint, {
    //   method,
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(strategy),
    // });

    // if (response.ok) {
    //   router.push("/dashboard/strategies");
    //   router.refresh();
    // } else {
    //   // Handle error
    //   console.error("Failed to save strategy");
    // }
    console.log("Strategy form submitted:", strategy);
    router.push("/dashboard/strategies"); // Navigate back for now
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Strategy" : "Create New Strategy"}</CardTitle>
        <CardDescription>
          {isEditing ? "Update the details of your trading strategy." : "Define a new trading strategy to track and journal."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Strategy Name</Label>
            <Input id="name" name="name" value={strategy.name} onChange={handleChange} placeholder="e.g., QQQ 5-min ORB" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" value={strategy.description} onChange={handleChange} placeholder="Brief overview of the strategy" />
          </div>
          {/* Trader Insight: These fields are crucial for a well-defined strategy */}
          <div className="space-y-2">
            <Label htmlFor="assetClasses">Asset Classes (comma-separated)</Label>
            <Input id="assetClasses" name="assetClasses" value={strategy.assetClasses.join(", ")} 
                   onChange={(e) => setStrategy((prev:any) => ({...prev, assetClasses: e.target.value.split(',').map(s => s.trim())}))} 
                   placeholder="e.g., Crypto, Forex, Stocks" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="indicatorsUsed">Indicators Used</Label>
            <Input id="indicatorsUsed" name="indicatorsUsed" value={strategy.indicatorsUsed} onChange={handleChange} placeholder="e.g., EMA 9, EMA 20, RSI, MACD" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timeframes">Timeframes</Label>
            <Input id="timeframes" name="timeframes" value={strategy.timeframes} onChange={handleChange} placeholder="e.g., 1min, 5min, 1H, Daily" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="entryRules">Entry Rules</Label>
            <Textarea id="entryRules" name="entryRules" value={strategy.entryRules} onChange={handleChange} placeholder="Specific conditions for entering a trade" rows={4} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="exitRules">Exit Rules (Profit Taking & Stop Loss)</Label>
            <Textarea id="exitRules" name="exitRules" value={strategy.exitRules} onChange={handleChange} placeholder="Specific conditions for exiting a trade (TP and SL)" rows={4} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="riskManagement">Risk Management Rules</Label>
            <Textarea id="riskManagement" name="riskManagement" value={strategy.riskManagement} onChange={handleChange} placeholder="e.g., Max 1% risk per trade, R:R ratio" rows={3} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">General Notes</Label>
            <Textarea id="notes" name="notes" value={strategy.notes} onChange={handleChange} placeholder="Any other relevant information or observations" rows={3} />
          </div>
          <div className="flex justify-end">
            <Button type="submit">{isEditing ? "Save Changes" : "Create Strategy"}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}