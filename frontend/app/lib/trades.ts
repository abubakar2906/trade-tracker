import { apiFetch } from "./api"

export async function getTrades() {
  return apiFetch("/api/trades")
}

export async function addTrade(trade: any) {
  return apiFetch("/api/trades", {
    method: "POST",
    body: JSON.stringify(trade),
  })
}

export async function updateTrade(id: string, trade: any) {
  return apiFetch(`/api/trades/${id}`, {
    method: "PUT",
    body: JSON.stringify(trade),
  })
}

export async function deleteTrade(id: string) {
  return apiFetch(`/api/trades/${id}`, {
    method: "DELETE",
  })
}