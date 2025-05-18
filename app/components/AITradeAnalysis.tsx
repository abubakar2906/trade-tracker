"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import type { Trade } from "../types/trade"

interface AITradeAnalysisProps {
  trades: Trade[]
}

export default function AITradeAnalysis({ trades }: AITradeAnalysisProps) {
  const [analysis, setAnalysis] = useState("")
  const [loading, setLoading] = useState(false)

  const generateAnalysis = async () => {
    setLoading(true)
    try {
      const prompt = `Analyze the following trades and provide insights and recommendations:
      ${JSON.stringify(trades)}
      
      Please include:
      1. Overall performance summary
      2. Strengths and weaknesses in trading strategy
      3. Patterns or trends observed
      4. Suggestions for improvement
      5. Risk management assessment
      `

      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt: prompt,
      })

      setAnalysis(text)
    } catch (error) {
      console.error("Error generating analysis:", error)
      setAnalysis("An error occurred while generating the analysis. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Trade Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={generateAnalysis} disabled={loading}>
          {loading ? "Generating Analysis..." : "Generate AI Analysis"}
        </Button>
        {analysis && <Textarea className="mt-4" value={analysis} readOnly rows={15} />}
      </CardContent>
    </Card>
  )
}

