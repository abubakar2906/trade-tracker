"use client"

import { apiFetch } from "./api"

export async function addTradeAction(values: any) {
  try {
    const trade = await apiFetch("/api/trades", {
      method: "POST",
      body: JSON.stringify({
        symbol: values.symbol,
        tradeType: values.type,
        entryPrice: values.entryPrice,
        exitPrice: values.exitPrice ?? null,
        quantity: values.quantity,
        entryDate: new Date(values.date).toISOString(),
        exitDate: null,
        profitLoss: values.exitPrice
          ? (values.exitPrice - values.entryPrice) * values.quantity * (values.action === "buy" ? 1 : -1)
          : null,
        notes: values.rationale ?? null,
        status: values.exitPrice ? "closed" : "open",
      }),
    })
    return { success: true, message: "Trade added successfully!", tradeId: trade.id }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}

export interface ActionResponse {
  success: boolean
  message?: string
  tradeId?: string
}