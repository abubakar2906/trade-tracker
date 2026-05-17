"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { apiFetch } from "@/app/lib/api"
import InsightCards, { type Insight } from "../../../components/InsightCards"
import { Brain, Send, Loader2, User, Bot, Sparkles, MessageCircle } from "lucide-react"

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

const SUGGESTED_QUESTIONS = [
  "What's my biggest weakness?",
  "Which symbol is my edge?",
  "Am I following my strategy?",
  "When do I revenge trade?",
]

export default function AICoachPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function sendMessage(content: string) {
    if (!content.trim() || loading) return

    const userMessage: ChatMessage = { role: "user", content: content.trim() }
    const updated = [...messages, userMessage]
    setMessages(updated)
    setInput("")
    setLoading(true)

    try {
      const result = await apiFetch("/api/ai/chat", {
        method: "POST",
        body: JSON.stringify({
          message: content.trim(),
          history: updated.slice(-10),
        }),
      })
      setMessages(prev => [...prev, { role: "assistant", content: result.reply }])
    } catch (err: any) {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: `I ran into an issue: ${err.message || "Please try again."}`
      }])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  function handleInsightClick(insight: Insight) {
    const question = `Tell me more about "${insight.title}". The finding was: "${insight.finding}". What specific trades or patterns drove this, and what are the concrete next steps?`
    sendMessage(question)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] gap-0">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 shrink-0">
        <div className="rounded-lg bg-primary/10 p-2">
          <Brain className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold leading-tight">AI Coach</h1>
          <p className="text-xs text-muted-foreground">Your personal trading performance analyst</p>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0">

        {/* ── Left: Scrollable Insight Cards ── */}
        <div className="w-full lg:w-[400px] shrink-0 overflow-y-auto pr-1 space-y-3">
          <InsightCards onAskAbout={handleInsightClick} vertical />
        </div>

        {/* ── Right: Chat Interface ── */}
        <Card className="flex-1 flex flex-col overflow-hidden min-h-[400px] lg:min-h-0">
          {/* Chat Header */}
          <div className="border-b border-border px-4 py-3 flex items-center gap-2 bg-card shrink-0">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="font-semibold text-sm">Chat</span>
            <span className="text-xs text-muted-foreground ml-auto">Llama 3.3 · 70B</span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-background/30">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-6">
                <div className="rounded-full bg-muted p-3">
                  <Bot className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-1">Ask me about your trading</h3>
                  <p className="text-xs text-muted-foreground max-w-[240px]">
                    Click any insight card to dive deeper, or type your own question.
                  </p>
                </div>
                <div className="flex flex-col gap-1.5 w-full max-w-[260px]">
                  {SUGGESTED_QUESTIONS.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(q)}
                      className="text-xs text-left px-3 py-2 rounded-lg border border-border hover:bg-muted hover:border-primary/30 transition-all text-muted-foreground hover:text-foreground flex items-center gap-2"
                    >
                      <MessageCircle className="h-3 w-3 shrink-0" />
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg, i) => (
                  <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.role === "assistant" && (
                      <div className="rounded-full bg-primary/10 h-6 w-6 flex items-center justify-center shrink-0 mt-0.5">
                        <Bot className="h-3.5 w-3.5 text-primary" />
                      </div>
                    )}
                    <div className={`rounded-2xl px-3.5 py-2.5 max-w-[85%] text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-muted rounded-bl-md"
                    }`}>
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                    {msg.role === "user" && (
                      <div className="rounded-full bg-muted h-6 w-6 flex items-center justify-center shrink-0 mt-0.5">
                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                ))}
                {loading && (
                  <div className="flex gap-2 justify-start">
                    <div className="rounded-full bg-primary/10 h-6 w-6 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div className="bg-muted rounded-2xl rounded-bl-md px-3.5 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-border p-3 bg-card shrink-0">
            <form onSubmit={(e) => { e.preventDefault(); sendMessage(input) }} className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your trades..."
                className="flex-1 bg-muted border border-border rounded-lg px-3.5 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
                disabled={loading}
              />
              <Button type="submit" size="icon" disabled={loading || !input.trim()} className="shrink-0 h-9 w-9">
                <Send className="h-3.5 w-3.5" />
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  )
}
