import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ThemeProvider } from '@/components/theme-provider'

export default function LandingPage() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <div className="min-h-screen bg-background text-foreground flex flex-col">

        {/* Nav */}
        <nav className="flex items-center justify-between px-8 py-6 border-b border-border sticky top-0 bg-background/80 backdrop-blur-md z-50">
          <img src="/tradetracker-full.svg" alt="TradeTracker" className="h-8 w-auto" />
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Login
            </Link>
            <Button asChild size="sm">
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="flex-1 flex flex-col items-center justify-center px-6 text-center relative overflow-hidden py-24">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:64px_64px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted text-xs text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              Built for serious traders
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-tight">
              Know every trade.
              <br />
              <span className="text-muted-foreground">Own your edge.</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
              TradeTracker gives you a complete picture of your performance — P&L, win rate, R:R ratio, emotional patterns, and strategy insights all in one place.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Button asChild size="lg" className="w-full sm:w-auto px-8">
                <Link href="/signup">Start Tracking Free</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto px-8">
                <Link href="/login">Sign In</Link>
              </Button>
            </div>

            <p className="text-xs text-muted-foreground pt-2">
              No credit card required · Forex, Crypto, Stocks & more
            </p>
          </div>

          {/* Dashboard screenshot mockup */}
          <div className="relative z-10 mt-20 w-full max-w-5xl mx-auto">
            <div className="rounded-xl border border-border bg-muted/30 overflow-hidden shadow-2xl">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/50">
                <div className="h-3 w-3 rounded-full bg-red-500/70" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
                <div className="h-3 w-3 rounded-full bg-green-500/70" />
                <div className="ml-4 flex-1 bg-background/50 rounded-md px-3 py-1 text-xs text-muted-foreground text-left">
                  tradetracker.vercel.app/dashboard
                </div>
              </div>
              {/* Screenshot */}
              <img
                src="/screenshots/dashboard.png"
                alt="TradeTracker Dashboard"
                className="w-full object-cover object-top"
              />
            </div>
            {/* Fade bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-6 border-t border-border">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <p className="text-xs text-muted-foreground uppercase tracking-widest">What you get</p>
              <h2 className="text-3xl sm:text-4xl font-bold">Everything a trader needs</h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Stop guessing why you're losing. TradeTracker turns your raw trades into actionable insights.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Live P&L Preview",
                  description: "See your profit, loss, percentage gain and R:R ratio calculated in real time as you log a trade — before you even submit it.",
                  icon: "📈",
                },
                {
                  title: "Emotional Tracking",
                  description: "Tag every trade with your emotional state — Confident, FOMO, Anxious, Disciplined. Spot the patterns that are costing you money.",
                  icon: "🧠",
                },
                {
                  title: "Strategy Journal",
                  description: "Define your strategies with entry rules, exit rules, and risk management. Journal every trade against them and track what's actually working.",
                  icon: "📓",
                },
                {
                  title: "Win Rate & Streaks",
                  description: "Know your win rate, current streak, and profit factor at a glance. No spreadsheets needed.",
                  icon: "🎯",
                },
                {
                  title: "Risk Management",
                  description: "Track your stop loss, take profit, and amount risked on every trade. Build discipline through data.",
                  icon: "🛡️",
                },
                {
                  title: "Multi-Asset Support",
                  description: "Forex, Crypto, Stocks, Futures, Options — log trades across any market in one place.",
                  icon: "🌍",
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="p-6 rounded-xl border border-border bg-muted/20 hover:bg-muted/40 transition-colors space-y-3"
                >
                  <span className="text-2xl">{feature.icon}</span>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trade Journal Section */}
        <section className="py-24 px-6 border-t border-border">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <p className="text-xs text-muted-foreground uppercase tracking-widest">Trade Journal</p>
              <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
                Log trades the way
                <br />
                <span className="text-muted-foreground">pros actually do.</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Every detail matters. Entry price, exit price, lot size, stop loss, take profit, amount invested, emotional state, and notes — all captured in one clean form.
              </p>
              <ul className="space-y-3">
                {[
                  "Auto-calculated P&L and R:R ratio",
                  "Emotional state tagging per trade",
                  "Open and closed trade tracking",
                  "Trade duration automatically calculated",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button asChild>
                <Link href="/signup">Start Logging Trades</Link>
              </Button>
            </div>

            {/* Trade form screenshot mockup */}
            <div className="rounded-xl border border-border bg-muted/30 overflow-hidden shadow-2xl">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/50">
                <div className="h-3 w-3 rounded-full bg-red-500/70" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
                <div className="h-3 w-3 rounded-full bg-green-500/70" />
                <div className="ml-4 flex-1 bg-background/50 rounded-md px-3 py-1 text-xs text-muted-foreground text-left">
                  tradetracker.vercel.app/dashboard/trades
                </div>
              </div>
              <img
                src="/screenshots/trades.png"
                alt="TradeTracker Trade Journal"
                className="w-full object-cover object-top"
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6 border-t border-border">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Ready to trade smarter?
            </h2>
            <p className="text-muted-foreground">
              Join traders who are taking their performance seriously. Start tracking today — it's free.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="w-full sm:w-auto px-8">
                <Link href="/signup">Create Free Account</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto px-8">
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <img src="/tradetracker-full.svg" alt="TradeTracker" className="h-6 w-auto opacity-80" />
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} TradeTracker. Built for traders who take it seriously.
          </p>
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <Link href="/login" className="hover:text-foreground transition-colors">Login</Link>
            <Link href="/signup" className="hover:text-foreground transition-colors">Sign Up</Link>
          </div>
        </footer>

      </div>
    </ThemeProvider>
  )
}