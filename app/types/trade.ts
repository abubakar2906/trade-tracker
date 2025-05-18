// types/trade.ts
import { z } from "zod";

// Zod schema for validating a single trade
export const TradeSchema = z.object({
  id: z.string().optional(), // Optional: for editing existing trades
  symbol: z.string().min(1, "Symbol is required"),
  entryPrice: z.coerce.number().positive("Entry price must be positive"), // coerce converts string from input to number
  exitPrice: z.coerce.number().positive("Exit price must be positive").optional().nullable(), // Optional for open trades
  stopLoss: z.coerce.number().positive("Stop loss must be positive").optional().nullable(),
  takeProfit: z.coerce.number().positive("Take profit must be positive").optional().nullable(),
  quantity: z.coerce.number().positive("Quantity must be positive"),
  date: z.string().min(1, "Date is required"), // Or z.date() if you handle conversion
  type: z.enum(["crypto", "forex", "stock", "futures", "options"], { // Expanded types
    required_error: "Trade type is required.",
  }),
  action: z.enum(["buy", "sell"], {
    required_error: "Action (buy/sell) is required.",
  }),
  strategyId: z.string().optional().nullable(), // Link to a strategy
  rationale: z.string().optional().nullable(),
  tags: z.array(z.string()).optional().default([]), // Array of strings for tags
  // userId: z.string(), // Will be added on the server from session
  // createdAt: z.date().optional(),
  // updatedAt: z.date().optional(),
});

// TypeScript type inferred from the Zod schema
export type TradeFormValues = z.infer<typeof TradeSchema>;

// Potentially a more complete TradeType for data fetched from DB
export interface TradeType extends TradeFormValues {
  id: string; // Non-optional when fetched
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  // You might add calculated fields like P/L here if fetched
  profitLoss?: number; 
}