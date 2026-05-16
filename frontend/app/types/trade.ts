import { z } from "zod";

export const TradeSchema = z.object({
  symbol: z.string().min(1, "Symbol is required"),
  bias: z.enum(["BULLISH", "BEARISH", "NEUTRAL"]),
  date: z.string().min(1, "Date is required"),
  entryPoint: z.string().optional(),
  tradeDuration: z.string().optional(),
  riskReward: z.string().optional(),
  profitLoss: z.coerce.number().optional(),
  winLoss: z.enum(["WIN", "LOSS", "BREAKEVEN"]).optional(),
  comment: z.string().optional(),
  timeframes: z.array(z.string()).default([]),
  setups: z.array(z.string()).default([]),
  emotions: z.array(z.string()).default([]),
});

export type TradeFormValues = z.infer<typeof TradeSchema>;

export interface Trade {
  id: string;
  userId: string;
  symbol: string;
  bias: "BULLISH" | "BEARISH" | "NEUTRAL";
  date: string;
  entryPoint?: string | null;
  tradeDuration?: string | null;
  riskReward?: string | null;
  profitLoss?: number | null;
  winLoss?: "WIN" | "LOSS" | "BREAKEVEN" | null;
  comment?: string | null;
  timeframes: string[];
  setups: string[];
  emotions: string[];
  createdAt?: string;
  updatedAt?: string;
}