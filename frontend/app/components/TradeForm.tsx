"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiFetch } from "../lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Form, FormControl, FormField,
  FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Target } from "lucide-react";

const TradeSchema = z.object({
  symbol: z.string().min(1, "Symbol is required"),
  tradeType: z.string().min(1, "Trade type is required"),
  action: z.enum(["buy", "sell"]),
  entryPrice: z.coerce.number().positive("Must be positive"),
  exitPrice: z.coerce.number().positive().optional().or(z.literal("")),
  quantity: z.coerce.number().positive("Must be positive"),
  amountInvested: z.coerce.number().positive().optional().or(z.literal("")),
  stopLoss: z.coerce.number().positive().optional().or(z.literal("")),
  takeProfit: z.coerce.number().positive().optional().or(z.literal("")),
  entryDate: z.string().min(1, "Entry date is required"),
  exitDate: z.string().optional(),
  emotionalState: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(["open", "closed"]),
});

type TradeFormValues = z.infer<typeof TradeSchema>;

const symbolOptions: Record<string, string[]> = {
  crypto: ["BTC/USD", "ETH/USD", "XRP/USD", "LTC/USD", "ADA/USD"],
  forex: ["EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD", "USD/CHF", "EUR/GBP"],
  stock: ["AAPL", "MSFT", "GOOG", "TSLA", "AMZN"],
  futures: ["ES", "NQ", "CL", "GC"],
  options: ["SPY C", "SPY P", "QQQ C", "QQQ P"],
};

const emotionalStates = [
  "Confident", "Anxious", "FOMO", "Disciplined",
  "Revenge Trading", "Neutral", "Excited", "Fearful",
];

export default function TradeForm({ onSuccess }: { onSuccess?: () => void }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [symbolList, setSymbolList] = useState<string[]>([]);
  const [preview, setPreview] = useState<{
    pnl: number | null;
    rrRatio: number | null;
    percentageGain: number | null;
    risk: number | null;
  }>({ pnl: null, rrRatio: null, percentageGain: null, risk: null });

  const form = useForm<TradeFormValues>({
    resolver: zodResolver(TradeSchema),
    defaultValues: {
      symbol: "",
      tradeType: "forex",
      action: "buy",
      entryPrice: "" as any,
      exitPrice: "",
      quantity: "" as any,
      amountInvested: "",
      stopLoss: "",
      takeProfit: "",
      entryDate: new Date().toISOString().split("T")[0],
      exitDate: "",
      emotionalState: "",
      notes: "",
      status: "open",
    },
  });

  const watched = form.watch();

  useEffect(() => {
    const options = symbolOptions[watched.tradeType] || [];
    setSymbolList(options);
    const currentSymbol = form.getValues("symbol");
    if (currentSymbol && !options.includes(currentSymbol)) {
      form.setValue("symbol", "");
    }
  }, [watched.tradeType]);

  useEffect(() => {
    const { entryPrice, exitPrice, quantity, amountInvested, stopLoss, takeProfit, action } = watched;

    const ep = Number(entryPrice);
    const xp = Number(exitPrice);
    const qty = Number(quantity);
    const invested = Number(amountInvested);
    const sl = Number(stopLoss);
    const tp = Number(takeProfit);

    const pnl = ep && xp && qty
      ? (xp - ep) * qty * (action === "buy" ? 1 : -1)
      : null;

    const percentageGain = pnl && invested ? (pnl / invested) * 100 : null;

    const risk = ep && sl && qty ? Math.abs(ep - sl) * qty : null;
    const reward = ep && tp && qty ? Math.abs(tp - ep) * qty : null;
    const rrRatio = risk && reward ? reward / risk : null;

    setPreview({ pnl, rrRatio, percentageGain, risk });
  }, [
    watched.entryPrice, watched.exitPrice, watched.quantity,
    watched.amountInvested, watched.stopLoss, watched.takeProfit, watched.action
  ]);

  const onSubmit = async (values: TradeFormValues) => {
    setLoading(true);
    setError("");
    try {
      await apiFetch("/api/trades", {
        method: "POST",
        body: JSON.stringify({
          ...values,
          exitPrice: values.exitPrice || null,
          amountInvested: values.amountInvested || null,
          stopLoss: values.stopLoss || null,
          takeProfit: values.takeProfit || null,
          exitDate: values.exitDate || null,
          emotionalState: values.emotionalState || null,
        }),
      });
      form.reset();
      setPreview({ pnl: null, rrRatio: null, percentageGain: null, risk: null });
      if (onSuccess) onSuccess();
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to log trade");
    } finally {
      setLoading(false);
    }
  };

  const pnlColor = preview.pnl === null ? "" : preview.pnl >= 0 ? "text-green-500" : "text-red-500";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

        {/* Live Preview Card */}
        {(preview.pnl !== null || preview.rrRatio !== null) && (
          <Card className="border-dashed">
            <CardContent className="pt-4">
              <p className="text-xs text-muted-foreground mb-3">Live Trade Preview</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {preview.pnl !== null && (
                  <div className="flex items-center gap-2">
                    {preview.pnl >= 0
                      ? <TrendingUp className="h-4 w-4 text-green-500" />
                      : <TrendingDown className="h-4 w-4 text-red-500" />}
                    <div>
                      <p className="text-xs text-muted-foreground">P&L</p>
                      <p className={`font-bold ${pnlColor}`}>
                        {preview.pnl >= 0 ? "+" : ""}${preview.pnl.toFixed(2)}
                      </p>
                    </div>
                  </div>
                )}
                {preview.percentageGain !== null && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">% Gain</p>
                      <p className={`font-bold ${pnlColor}`}>
                        {preview.percentageGain >= 0 ? "+" : ""}{preview.percentageGain.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                )}
                {preview.rrRatio !== null && (
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">R:R Ratio</p>
                      <p className="font-bold">1 : {preview.rrRatio.toFixed(2)}</p>
                    </div>
                  </div>
                )}
                {preview.risk !== null && (
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-red-400" />
                    <div>
                      <p className="text-xs text-muted-foreground">Risk</p>
                      <p className="font-bold text-red-400">${preview.risk.toFixed(2)}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Row 1: Type, Action, Status */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FormField
            control={form.control}
            name="tradeType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Asset Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.keys(symbolOptions).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
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
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue /></SelectTrigger>
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
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Row 2: Symbol, Entry Date, Exit Date */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FormField
            control={form.control}
            name="symbol"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Symbol</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select symbol" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {symbolList.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="entryDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Entry Date</FormLabel>
                <FormControl><Input type="date" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="exitDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Exit Date <span className="text-xs text-muted-foreground">(Optional)</span></FormLabel>
                <FormControl><Input type="date" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Row 3: Entry Price, Exit Price, Quantity, Amount Invested */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <FormField
            control={form.control}
            name="entryPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Entry Price</FormLabel>
                <FormControl>
                  <Input type="number" step="any" placeholder="0.00" {...field} />
                </FormControl>
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
                <FormControl>
                  <Input type="number" step="any" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{watched.tradeType === "forex" ? "Lot Size" : "Quantity"}</FormLabel>
                <FormControl>
                  <Input type="number" step="any" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="amountInvested"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount Invested <span className="text-xs text-muted-foreground">(Optional)</span></FormLabel>
                <FormControl>
                  <Input type="number" step="any" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Row 4: Stop Loss, Take Profit */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="stopLoss"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stop Loss <span className="text-xs text-muted-foreground">(Optional)</span></FormLabel>
                <FormControl>
                  <Input type="number" step="any" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="takeProfit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Take Profit <span className="text-xs text-muted-foreground">(Optional)</span></FormLabel>
                <FormControl>
                  <Input type="number" step="any" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Row 5: Emotional State */}
        <FormField
          control={form.control}
          name="emotionalState"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Emotional State <span className="text-xs text-muted-foreground">(Optional)</span></FormLabel>
              <div className="flex flex-wrap gap-2 mt-1">
                {emotionalStates.map((state) => (
                  <Badge
                    key={state}
                    variant={field.value === state ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => field.onChange(field.value === state ? "" : state)}
                  >
                    {state}
                  </Badge>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Row 6: Notes */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes <span className="text-xs text-muted-foreground">(Optional)</span></FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Trade rationale, observations, lessons learned..."
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
          {loading ? "Logging Trade..." : "Log Trade"}
        </Button>
      </form>
    </Form>
  );
}