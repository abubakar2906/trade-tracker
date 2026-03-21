// types/trade.ts
import { z } from "zod";

export const TradeSchema = z.object({
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

export type TradeFormValues = z.infer<typeof TradeSchema>;

export interface Trade {
  id: string;
  userId: string;
  symbol: string;
  tradeType: string;
  action: string;
  entryPrice: number;
  exitPrice?: number | null;
  quantity: number;
  amountInvested?: number | null;
  stopLoss?: number | null;
  takeProfit?: number | null;
  profitLoss?: number | null;
  percentageGain?: number | null;
  riskRewardRatio?: number | null;
  emotionalState?: string | null;
  notes?: string | null;
  status: string;
  entryDate: string;
  exitDate?: string | null;
  createdAt?: string;
  updatedAt?: string;
}