// components/TradeForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition, useEffect } from "react"; // useEffect was missing in your provided file

import { TradeSchema, TradeFormValues } from "../types/trade"; // Ensure this path is correct
import { addTradeAction, ActionResponse } from "../lib/actions"; // Ensure this path is correct

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// Label is not directly used when using FormField's FormLabel, but good to keep if you have other uses
// import { Label } from "@/components/ui/label"; 
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
// import { toast } from "sonner"; // Example for Sonner toasts

// --- Constants ---
const NO_SELECTION_VALUE = "__NONE__"; // For "None" or placeholder-like options in Select

// --- Mock Data (Replace with fetched data or props in a real app) ---
const mockStrategies = [
  { id: "strat1", name: "Mean Reversion Scalp" },
  { id: "strat2", name: "Breakout Momentum" },
  { id: "strat3", name: "Trend Following Swing" },
];

const symbolOptions: Record<string, string[]> = {
  crypto: ["BTC/USD", "ETH/USD", "XRP/USD", "LTC/USD", "ADA/USD"],
  forex: ["EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD", "USD/CHF", "EUR/GBP"],
  stock: ["AAPL", "MSFT", "GOOG", "TSLA", "AMZN"],
  futures: ["ES", "NQ", "CL", "GC"],
  options: ["SPY C", "SPY P", "QQQ C", "QQQ P"],
};

export default function TradeForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [actionFeedback, setActionFeedback] = useState<{ type: 'error' | 'success'; message: string } | null>(null);
  // Removed selectedTradeType state, will rely on form.watch("type")

  const form = useForm<TradeFormValues>({
    resolver: zodResolver(TradeSchema),
    defaultValues: {
      symbol: "", // Default to empty string, Select will show placeholder
      entryPrice: undefined,
      exitPrice: undefined,
      stopLoss: undefined,
      takeProfit: undefined, // Keep if in schema, otherwise remove
      quantity: undefined,
      date: new Date().toISOString().split("T")[0],
      type: "forex",
      action: "buy",
      strategyId: null, // Use null to represent "no strategy"
      rationale: "",
      tags: [],
    },
  });

  const onSubmit = (values: TradeFormValues) => {
    setActionFeedback(null);
    startTransition(async () => {
      try {
        const processedValues = {
          ...values,
          tags: Array.isArray(values.tags)
            ? values.tags.filter(tag => typeof tag === 'string' && tag.trim() !== '')
            : (typeof values.tags === 'string' && values.tags.trim() !== '')
              ? values.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
              : [],
          // strategyId is already null if NO_SELECTION_VALUE was chosen and handled by onValueChange
        };

        const result: ActionResponse = await addTradeAction(processedValues);

        if (result.success) {
          setActionFeedback({ type: 'success', message: result.message || "Trade added successfully!" });
          // toast.success(result.message || "Trade added successfully!");
          form.reset();
          router.refresh();
        } else {
          setActionFeedback({ type: 'error', message: result.message || "An unknown error occurred." });
          if (result.errors) {
            result.errors.forEach(err => {
              const fieldName = err.path.join('.') as keyof TradeFormValues;
              form.setError(fieldName, { message: err.message });
            });
          }
          // toast.error(result.message || "Failed to add trade.");
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
        setActionFeedback({ type: 'error', message: "Submission failed: " + errorMessage });
        // toast.error("Submission failed. Please try again.");
      }
    });
  };

  const watchedTradeType = form.watch("type");
  const [currentSymbolOptions, setCurrentSymbolOptions] = useState<string[]>([]);

  useEffect(() => {
    // Update symbol options when trade type changes
    const newOptions = symbolOptions[watchedTradeType as keyof typeof symbolOptions] || [];
    setCurrentSymbolOptions(newOptions);
    
    // Reset symbol field only if the type has actually changed from its previous value
    // This prevents resetting if the component re-renders but type hasn't changed
    if (form.getValues("type") === watchedTradeType) {
        // Check if the current symbol is valid for the new type, if not, reset
        const currentSymbol = form.getValues("symbol");
        if (currentSymbol && !newOptions.includes(currentSymbol)) {
            form.setValue("symbol", "", { shouldValidate: true });
        } else if (!currentSymbol && newOptions.length > 0) {
            // If no symbol is set and there are options, no need to reset to empty
        } else if (newOptions.length === 0) {
             form.setValue("symbol", "", { shouldValidate: true });
        }
    }
  }, [watchedTradeType, form]);

  const handleNumberInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldChange: (value: number | undefined) => void
  ) => {
    const val = e.target.value;
    fieldChange(val === '' ? undefined : parseFloat(val));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Row 1: Trade Type & Action */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Asset Type</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value as TradeFormValues['type']);
                    // The useEffect will handle symbol reset and options update
                  }}
                  value={field.value} // Use value directly from field
                >
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select asset type" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.keys(symbolOptions).map(type => (
                      <SelectItem key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="action"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Action</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}> {/* Use value directly */}
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select action" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="buy">Buy (Long)</SelectItem>
                    <SelectItem value="sell">Sell (Short)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Row 2: Symbol & Date */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="symbol"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Symbol</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}> {/* Keep || "" for placeholder */}
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select symbol" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {currentSymbolOptions.length > 0 ? (
                      currentSymbolOptions.map((symbol) => (
                        <SelectItem key={symbol} value={symbol}> {/* Ensure symbol is not "" */}
                          {symbol}
                        </SelectItem>
                      ))
                    ) : (
                      // Use a non-empty, non-selectable value for the disabled item
                      <SelectItem value={NO_SELECTION_VALUE} disabled>
                        {watchedTradeType ? "No symbols for this type" : "Select an asset type first"}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl><Input type="date" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Row 3: Entry, Quantity, SL, Exit Prices */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <FormField
            control={form.control}
            name="entryPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Entry Price</FormLabel>
                <FormControl><Input type="number" step="any" placeholder="0.00" value={field.value ?? ''} onChange={e => handleNumberInputChange(e, field.onChange)} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
            <FormItem>
                <FormLabel>{watchedTradeType === "forex" ? "Lot Size" : "Quantity"}</FormLabel>
                <FormControl><Input type="number" step="any" placeholder="e.g., 1 or 0.01" value={field.value ?? ''} onChange={e => handleNumberInputChange(e, field.onChange)}/></FormControl>
                <FormMessage />
            </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stopLoss"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stop Loss <span className="text-xs text-muted-foreground">(Optional)</span></FormLabel>
                <FormControl><Input type="number" step="any" placeholder="0.00" value={field.value ?? ''} onChange={e => handleNumberInputChange(e, field.onChange)}/></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="exitPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Exit Price <span className="text-xs text-muted-foreground">(Optional)</span></FormLabel>
                <FormControl><Input type="number" step="any" placeholder="0.00" value={field.value ?? ''} onChange={e => handleNumberInputChange(e, field.onChange)}/></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Removed TakeProfit as it was redundant with ExitPrice in this simplified form */}
        </div>

        {/* Row 4: Strategy & Tags */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="strategyId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Strategy <span className="text-xs text-muted-foreground">(Optional)</span></FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(value === NO_SELECTION_VALUE ? null : value)}
                  // If field.value is null/undefined (no strategy), Select value becomes NO_SELECTION_VALUE to show "None"
                  // Otherwise, it's the actual strategyId
                  value={field.value === null || field.value === undefined ? NO_SELECTION_VALUE : field.value}
                >
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select strategy" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={NO_SELECTION_VALUE}>None</SelectItem>
                    {mockStrategies.map(strat => (
                      <SelectItem key={strat.id} value={strat.id}>{strat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags <span className="text-xs text-muted-foreground">(Optional, comma-separated)</span></FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., breakout, news, fomo"
                    value={Array.isArray(field.value) ? field.value.join(", ") : ""}
                    onChange={e => field.onChange(e.target.value.split(',').map(t => t.trim()).filter(t => t))}
                  />
                </FormControl>
                <FormDescription>Helps in filtering and analysis.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Row 5: Rationale */}
        <FormField
          control={form.control}
          name="rationale"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trade Rationale <span className="text-xs text-muted-foreground">(Optional)</span></FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Why did you take this trade? What was the setup, confirmation, and emotional state?"
                  value={field.value || ''} // Ensure value is not null for textarea
                  onChange={field.onChange}
                  rows={4}
                />
              </FormControl>
              <FormDescription>Crucial for AI analysis and personal review.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {actionFeedback && (
          <p className={`text-sm font-medium mt-2 ${actionFeedback.type === 'error' ? 'text-destructive' : 'text-green-600'}`}>
            {actionFeedback.message}
          </p>
        )}

        <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
          {isPending ? "Logging Trade..." : "Log Trade"}
        </Button>
      </form>
    </Form>
  );
}