import type { Trade } from "../types/trade"

let trades: Trade[] = [
  {
    id: 1,
    symbol: "EUR/USD",
    entryPrice: "1.1850",
    exitPrice: "1.1920",
    quantity: "1",
    date: "2023-06-01",
    type: "forex",
    action: "buy",
  },
  {
    id: 2,
    symbol: "GBP/JPY",
    entryPrice: "150.75",
    exitPrice: "151.20",
    quantity: "0.5",
    date: "2023-06-02",
    type: "forex",
    action: "buy",
  },
  {
    id: 3,
    symbol: "BTC/USD",
    entryPrice: "35000",
    exitPrice: "36500",
    quantity: "0.1",
    date: "2023-06-03",
    type: "crypto",
    action: "buy",
  },
  {
    id: 4,
    symbol: "USD/CHF",
    entryPrice: "0.9150",
    exitPrice: "0.9100",
    quantity: "0.75",
    date: "2023-06-04",
    type: "forex",
    action: "sell",
  },
  {
    id: 5,
    symbol: "ETH/USD",
    entryPrice: "2400",
    exitPrice: "2350",
    quantity: "0.5",
    date: "2023-06-05",
    type: "crypto",
    action: "sell",
  },
  {
    id: 6,
    symbol: "AUD/USD",
    entryPrice: "0.7650",
    exitPrice: "0.7680",
    quantity: "1",
    date: "2023-06-06",
    type: "forex",
    action: "buy",
  },
  {
    id: 7,
    symbol: "XRP/USD",
    entryPrice: "0.85",
    exitPrice: "0.88",
    quantity: "1000",
    date: "2023-06-07",
    type: "crypto",
    action: "buy",
  },
  {
    id: 8,
    symbol: "EUR/GBP",
    entryPrice: "0.8620",
    exitPrice: "0.8590",
    quantity: "0.5",
    date: "2023-06-08",
    type: "forex",
    action: "sell",
  },
  {
    id: 9,
    symbol: "LTC/USD",
    entryPrice: "180",
    exitPrice: "185",
    quantity: "2",
    date: "2023-06-09",
    type: "crypto",
    action: "buy",
  },
  {
    id: 10,
    symbol: "USD/JPY",
    entryPrice: "109.50",
    exitPrice: "109.80",
    quantity: "0.75",
    date: "2023-06-10",
    type: "forex",
    action: "buy",
  },
]

export async function getTrades() {
  return trades
}

export async function addTrades(newTrades: Trade[]) {
  const tradesWithIds = newTrades.map((trade) => ({ ...trade, id: Date.now() + Math.random() }))
  trades = [...trades, ...tradesWithIds]
  return tradesWithIds
}

export async function getTopPerformers() {
  const types: ("crypto" | "forex")[] = ["crypto", "forex"]

  const topPerformers = types.reduce(
    (acc, type) => {
      const typeTrades = trades.filter((trade) => trade.type === type)
      const sortedTrades = typeTrades.sort((a, b) => {
        const profitA =
          (Number(a.exitPrice) - Number(a.entryPrice)) * Number(a.quantity) * (a.action === "buy" ? 1 : -1)
        const profitB =
          (Number(b.exitPrice) - Number(b.entryPrice)) * Number(b.quantity) * (b.action === "buy" ? 1 : -1)
        return profitB - profitA
      })
      acc[type] = sortedTrades.slice(0, 5)
      return acc
    },
    {} as Record<"crypto" | "forex", Trade[]>,
  )

  return topPerformers
}

