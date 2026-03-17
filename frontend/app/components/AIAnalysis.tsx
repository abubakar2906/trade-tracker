"use client"

import { useState } from "react"
import { useChat } from "ai/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Trade } from "../types/trade"

interface AIAnalysisProps {
  trades: Trade[]
}

export default function AIAnalysis({ trades }: AIAnalysisProps) {
  const [reportType, setReportType] = useState("daily")
  const { messages, input, handleInputChange, handleSubmit, setMessages } = useChat({
    api: "/api/analysis",
  })

  const generateReport = async () => {
    const tradesData = JSON.stringify(trades)
    const prompt = `Analyze the following trades and provide a ${reportType} report to improve trading skills:
    ${tradesData}
    
    Please include:
    1. Overall performance summary
    2. Winning and losing trades analysis
    3. Patterns or trends observed
    4. Suggestions for improvement
    5. Key metrics (win rate, average profit/loss, etc.)
    `

    setMessages([{ role: "user", content: prompt, id: Date.now().toString() }])

    const response = await fetch("/api/analysis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [{ role: "user", content: prompt }] }),
    })

    if (response.ok) {
      const reader = response.body?.getReader()
      let result = ""
      while (true) {
        const { done, value } = await reader!.read()
        if (done) break
        result += new TextDecoder().decode(value)
        setMessages([
          { role: "user", content: prompt, id: Date.now().toString() },
          { role: "assistant", content: result, id: (Date.now() + 1).toString() },
        ])
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-4">
        <Select value={reportType} onValueChange={setReportType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select report type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily Report</SelectItem>
            <SelectItem value="weekly">Weekly Report</SelectItem>
            <SelectItem value="monthly">Monthly Report</SelectItem>
            <SelectItem value="yearly">Yearly Report</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={generateReport} className="w-full sm:w-auto">
          Generate Report
        </Button>
      </div>
      <ScrollArea className="h-[400px] w-full rounded-md border p-4">
        {messages.map((message) => (
          <div key={message.id} className="mb-4">
            <p className="font-semibold">{message.role === "user" ? "You:" : "AI:"}</p>
            <p>{message.content}</p>
          </div>
        ))}
      </ScrollArea>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask for specific trading advice..."
          className="flex-grow"
        />
        <Button type="submit" className="w-full sm:w-auto">
          Send
        </Button>
      </form>
    </div>
  )
}

