"use client"

import { apiFetch } from "./api"

export async function addTradeAction(values: any) {
  try {
    const trade = await apiFetch("/api/trades", {
      method: "POST",
      body: JSON.stringify(values),
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