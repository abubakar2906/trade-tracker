import { NextResponse } from "next/server"
import { addTrades } from "../../lib/trades"

export async function POST(request: Request) {
  const trades = await request.json()
  const newTrades = await addTrades(trades)
  return NextResponse.json(newTrades)
}

