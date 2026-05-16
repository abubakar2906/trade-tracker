# Product Requirements Document — TradeTracker AI Feature

**Problem Statement**

Retail traders log trades but don’t know what their data is actually telling them. They can see their win rate but can’t interpret why they’re losing, what emotional patterns are costing them, or whether their strategy is actually working. The AI feature closes that gap automatically.

**Goal**

When a user imports trades or logs enough data, the system automatically analyses their trading behaviour and surfaces personalized insights without them having to ask for anything.

Version 1 — Pushed Insights
The trigger is the CSV import pipeline. As soon as trades are processed and stored, the AI pipeline fires. It takes three inputs — the cleaned trade data, the user’s strategy definition if they have one, and their aggregated stats. It sends that context to Groq with a pre-built system prompt and returns a structured JSON response containing insight cards. Those cards render on the dashboard and the report page.
Each insight card has a type — performance, emotional, strategy, or risk. A title. A finding. And a recommendation. That structure keeps the output consistent and renderable.
Examples of what gets surfaced: “Your win rate on EURUSD drops 40% on Fridays.” “You close trades early when you tag Anxious — your average R:R on those trades is 0.6 vs 1.8 when Disciplined.” “Your strategy rules say wait for pullback but 60% of your losing trades were entries without one.”

Version 2 — Chat Interface
A chat panel accessible from the dashboard. The model has context of the full account — trades, strategies, stats, emotional patterns. User can ask natural language questions. “What’s my biggest weakness?” “Compare my last 30 trades to my first 30.” “Am I following my strategy?” The same pipeline that powers v1 feeds the chat context.

Data Pipeline
CSV import → parse raw broker export → normalize into standard trade schema → store in PostgreSQL → trigger AI pipeline → format context block → send to Groq → parse JSON response → store insights → render on frontend.
The context block sent to Groq has four sections. First, the system prompt containing retail trading domain knowledge. Second, the user’s strategy definition in plain text. Third, a summary of their stats — win rate, average R:R, profit factor, emotional breakdown. Fourth, the last 50 trades in a compact structured format.

System Prompt Design
This is where the personalization lives. The system prompt establishes the model as a professional trading coach with deep retail trading knowledge — it knows what break of structure means, what revenge trading looks like in data, what a healthy R:R distribution should look like, what emotional patterns correlate with losses. It instructs the model to always reference the user’s actual data, never give generic advice, and always return structured JSON.

Constraints
Groq free tier — Llama 3.3 70B. Context window is large enough for 50 trades plus strategy plus stats comfortably. Response must be JSON only — no markdown, no prose outside the structured fields. Pipeline only triggers after minimum 10 trades to have enough data for meaningful analysis. Insights refresh on each new import or after 5 new manually logged trades.

What Success Looks Like
A user imports their MT5 history, lands on the dashboard, and sees three insight cards that feel like a coach who actually looked at their trades spoke to them directly. It doesn’t feel like ChatGPT. It feels like it knows them.

That’s the full scope. V1 is shippable in a focused weekend once the system prompt is right. Want to start designing the system prompt now or map out the pipeline schema first?