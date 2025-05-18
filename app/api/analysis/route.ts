import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { trades } = await req.json()

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

    return NextResponse.json({ analysis: text })
  } catch (error) {
    console.error("Error generating analysis:", error)
    return NextResponse.json({ error: "An error occurred while generating the analysis" }, { status: 500 })
  }
}

