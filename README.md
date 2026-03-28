# TradeTracker

TradeTracker is a premium, full-stack trading journal and performance analytics platform designed for serious traders. Stop guessing and start relying on data-driven insights to refine your trading edge across Forex, Crypto, Stocks, and more.

![TradeTracker Dashboard](/frontend/public/screenshots/dashboard.png)

## Key Features

- **Live Performance Analytics**: Real-time tracking of P&L, Win Rate, Profit Factor, and average R:R ratio.
- **Automated Broker Sync**: Seamless integration with MetaTrader 4/5 via MetaApi for automated trade synchronization.
- **Advanced Trading Journal**: Detailed logging including entry/exit prices, stop loss, take profit, quantity, and market conditions.
- **Psychology & Emotional Tracking**: Tag every trade with your emotional state (e.g., FOMO, Anxious, Disciplined) to identify and eliminate behavioral leaks.
- **Strategy Management**: Define your trading strategies with specific rules and track their individual performance over time.
- **Trade Journaling**: Rich-text notes and lesson-tracking for every strategy and trade.
- **Data Portability**: Support for CSV trade imports to bring in your historical data from other platforms.
- **Market Intelligence**: Integrated news and AI-powered insights to keep you ahead of the curve.

## Tech Stack

### Frontend
- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router, Server Components)
- **Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Radix UI](https://www.radix-ui.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Components**: shadcn/ui inspired premium component library

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express 5](https://expressjs.com/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (with `tsx` for development)

### Integrations
- **Broker Sync**: [MetaApi.cloud](https://metaapi.cloud/) (MT4/MT5 SDK)
- **AI/Analysis**: [OpenAI SDK](https://openai.com/)
- **Authentication**: JWT (JSON Web Tokens) & BcryptJS

## Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL database
- MetaApi account (for broker sync)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/trade-tracker.git
   cd trade-tracker
   ```

2. **Setup Backend**:
   ```bash
   cd backend
   npm install
   cp .env.example .env # Fill in your DB URL and API keys
   npm run db:push
   npm run dev
   ```

3. **Setup Frontend**:
   ```bash
   cd ../frontend
   npm install
   cp .env.local.example .env.local # Fill in your backend API URL
   npm run dev
   ```

## 📂 Project Structure

```text
├── backend/            # Express.js API
│   ├── prisma/         # Database schema & migrations
│   ├── src/
│   │   ├── routes/     # API endpoints
│   │   ├── services/   # Business logic (Broker sync, AI, etc.)
│   │   └── index.ts    # Main entry point
├── frontend/           # Next.js Application
│   ├── app/            # Pages & routing
│   ├── components/     # Reusable UI components
│   ├── lib/            # Utilities & API clients
│   └── styles/         # Global styles & Tailwind config
└── sample_trades.csv   # Example data for CSV import
```

## Environment Variables

### Backend (`/backend/.env`)
- `DATABASE_URL`: Your PostgreSQL connection string.
- `JWT_SECRET`: Secret key for JWT signing.
- `META_API_TOKEN`: Your MetaApi token.
- `OPENAI_API_KEY`: Your OpenAI API key.

### Frontend (`/frontend/.env.local`)
- `NEXT_PUBLIC_API_URL`: URL of the backend API (e.g., `http://localhost:5000/api`).

---

Built for the trading community.
