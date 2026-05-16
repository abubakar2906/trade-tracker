# Trade Log Feature Revamp Plan

**Core Trade Model**

# **Basic Trade Info**

| **Field** | **Type** | **Example** | **Notes** |
| --- | --- | --- | --- |
| symbol | string | "BU" | Trade ticker/pair |
| bias | enum | "bullish" | bullish / bearish / neutral |
| date | datetime | "2025-10-17" | Trade date |
| entryPoint | string / enum | "BB" | Could represent strategy trigger |
| profitLoss | number | -14 | Store as decimal |
| riskReward | string / object | "1:2" | Empty in screenshot |
| tradeDuration | string / number | "45m" | Empty in screenshot |
| winLoss | enum | "loss" | win / loss / breakeven |
| comment | text | "i need to work on my emotions..." | Journal notes |

# **Multi-Select Tags**

# **Timeframes**

This should be an array because multiple are selected.

timeframes: string[]

Example:

["1m", "5m", "15m", "1h", "4h", "D"]

Possible values:

type Timeframe =

| "1m"

| "5m"

| "15m"

| "30m"

| "1h"

| "4h"

| "D"

| "W"

| "M";

# **Suggested Schema Separation**

Instead of one giant table:

# **Tables**

**trades**

Core trade data.

**trade_tags**

Timeframes, setups, emotions.

**trade_reviews**

AI/manual reflections.

This scales much better later.