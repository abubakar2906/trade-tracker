"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { TradeSchema, TradeFormValues } from "../types/trade";

const timeframes = ["1m", "5m", "15m", "1h", "4h", "D"];
const emotionalStates = ["Confident", "Anxious", "FOMO", "Disciplined", "Revenge Trading", "Neutral"];
const commonSetups = ["Breakout", "Pullback", "Reversal", "Trend Following"];

export default function TradeForm({ onSuccess }: { onSuccess?: () => void }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<TradeFormValues>({
    resolver: zodResolver(TradeSchema),
    defaultValues: {
      symbol: "",
      bias: "BULLISH",
      date: new Date().toISOString().split("T")[0],
      entryPoint: "",
      tradeDuration: "",
      riskReward: "",
      profitLoss: undefined,
      winLoss: undefined,
      comment: "",
      timeframes: [],
      setups: [],
      emotions: [],
    },
  });

  const onSubmit = async (values: TradeFormValues) => {
    setLoading(true);
    setError("");
    try {
      await apiFetch("/api/trades", {
        method: "POST",
        body: JSON.stringify(values),
      });
      form.reset();
      if (onSuccess) onSuccess();
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to log trade");
    } finally {
      setLoading(false);
    }
  };

  const toggleArrayItem = (field: any, item: string) => {
    const current = field.value as string[];
    const updated = current.includes(item) 
      ? current.filter(i => i !== item)
      : [...current, item];
    field.onChange(updated);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Row 1: Symbol, Bias, Date */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FormField control={form.control} name="symbol" render={({ field }) => (
            <FormItem><FormLabel>Symbol</FormLabel><FormControl><Input placeholder="e.g. BTCUSD" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="bias" render={({ field }) => (
            <FormItem><FormLabel>Bias</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                <SelectContent>
                  <SelectItem value="BULLISH">Bullish</SelectItem>
                  <SelectItem value="BEARISH">Bearish</SelectItem>
                  <SelectItem value="NEUTRAL">Neutral</SelectItem>
                </SelectContent>
              </Select>
            <FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="date" render={({ field }) => (
            <FormItem><FormLabel>Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>

        {/* Row 2: Entry Point, Duration, Risk:Reward */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FormField control={form.control} name="entryPoint" render={({ field }) => (
            <FormItem><FormLabel>Entry Point / Trigger</FormLabel><FormControl><Input placeholder="e.g. Engulfing Candle" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="tradeDuration" render={({ field }) => (
            <FormItem><FormLabel>Duration</FormLabel><FormControl><Input placeholder="e.g. 45m" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="riskReward" render={({ field }) => (
            <FormItem><FormLabel>Risk:Reward</FormLabel><FormControl><Input placeholder="e.g. 1:2" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>

        {/* Row 3: Result, PnL */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField control={form.control} name="winLoss" render={({ field }) => (
            <FormItem><FormLabel>Result</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <FormControl><SelectTrigger><SelectValue placeholder="Select outcome" /></SelectTrigger></FormControl>
                <SelectContent>
                  <SelectItem value="WIN">Win</SelectItem>
                  <SelectItem value="LOSS">Loss</SelectItem>
                  <SelectItem value="BREAKEVEN">Break Even</SelectItem>
                </SelectContent>
              </Select>
            <FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="profitLoss" render={({ field }) => (
            <FormItem><FormLabel>Profit / Loss ($)</FormLabel><FormControl><Input type="number" step="any" placeholder="0.00" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>

        {/* Multi-select Tags */}
        <div className="space-y-4">
          <FormField control={form.control} name="timeframes" render={({ field }) => (
            <FormItem><FormLabel>Timeframes</FormLabel>
              <div className="flex flex-wrap gap-2">
                {timeframes.map(tf => (
                  <Badge key={tf} variant={field.value.includes(tf) ? "default" : "outline"} className="cursor-pointer transition-colors" onClick={() => toggleArrayItem(field, tf)}>
                    {tf}
                  </Badge>
                ))}
              </div>
            <FormMessage /></FormItem>
          )} />

          <FormField control={form.control} name="setups" render={({ field }) => (
            <FormItem><FormLabel>Setups</FormLabel>
              <div className="flex flex-wrap gap-2">
                {commonSetups.map(setup => (
                  <Badge key={setup} variant={field.value.includes(setup) ? "default" : "outline"} className="cursor-pointer transition-colors" onClick={() => toggleArrayItem(field, setup)}>
                    {setup}
                  </Badge>
                ))}
              </div>
            <FormMessage /></FormItem>
          )} />

          <FormField control={form.control} name="emotions" render={({ field }) => (
            <FormItem><FormLabel>Emotions</FormLabel>
              <div className="flex flex-wrap gap-2">
                {emotionalStates.map(em => (
                  <Badge key={em} variant={field.value.includes(em) ? "default" : "outline"} className="cursor-pointer transition-colors" onClick={() => toggleArrayItem(field, em)}>
                    {em}
                  </Badge>
                ))}
              </div>
            <FormMessage /></FormItem>
          )} />
        </div>

        {/* Comment */}
        <FormField control={form.control} name="comment" render={({ field }) => (
          <FormItem><FormLabel>Journal Comment</FormLabel>
            <FormControl><Textarea placeholder="What did you learn from this trade?" rows={3} {...field} value={field.value || ""} /></FormControl>
          <FormMessage /></FormItem>
        )} />

        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
          {loading ? "Saving..." : "Log Trade"}
        </Button>
      </form>
    </Form>
  );
}