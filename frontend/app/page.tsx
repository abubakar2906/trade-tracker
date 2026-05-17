"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ThemeProvider } from '@/components/theme-provider'
import { BarChart, Brain, Book, Target, Shield, Globe, Sparkles, LineChart, FileText, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import Tilt from 'react-parallax-tilt'

export default function LandingPage() {
  const FADE_UP = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <div className="min-h-screen bg-background text-foreground flex flex-col overflow-hidden">

        {/* Nav */}
        <motion.nav 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between px-8 py-6 border-b border-border sticky top-0 bg-background/80 backdrop-blur-md z-50"
        >
          <img src="/tradetracker-full.svg" alt="TradeTracker" className="h-8 w-auto" />
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Login
            </Link>
            <Button asChild size="sm" className="rounded-full px-5 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </motion.nav>

        {/* Hero Section */}
        <section className="flex-1 flex flex-col items-center justify-center px-6 text-center relative py-32">
          {/* Static Background Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />
          
          {/* Animated Breathing Glow */}
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" 
          />

          <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.15 } }
            }}
            className="relative z-10 max-w-4xl mx-auto space-y-8"
          >
            <motion.div variants={FADE_UP} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-xs font-medium text-primary shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Built for serious, data-driven traders
            </motion.div>

            <motion.h1 variants={FADE_UP} className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
              Know every trade.
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary/80 to-emerald-400">Master your edge.</span>
            </motion.h1>

            <motion.p variants={FADE_UP} className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              TradeTracker is the ultimate command center for your trading journey. Track P&L, win rates, risk-to-reward ratios, and emotional behavioral patterns all in one unified platform.
            </motion.p>

            <motion.div variants={FADE_UP} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button asChild size="lg" className="w-full sm:w-auto px-8 rounded-full h-14 text-base shadow-xl shadow-primary/20 hover:scale-105 transition-transform duration-300">
                <Link href="/signup">Start Tracking for Free <ChevronRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto px-8 rounded-full h-14 text-base hover:bg-muted/50 transition-colors">
                <Link href="/login">Sign In to Dashboard</Link>
              </Button>
            </motion.div>

            <motion.p variants={FADE_UP} className="text-xs text-muted-foreground pt-2 opacity-80">
              No credit card required · Supports Forex, Crypto, Stocks, Indices & Commodities
            </motion.p>
          </motion.div>

          {/* Dashboard screenshot mockup with Tilt */}
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            className="relative z-10 mt-24 w-full max-w-6xl mx-auto perspective-[2000px]"
          >
            <Tilt 
              tiltMaxAngleX={4} 
              tiltMaxAngleY={4} 
              scale={1.02} 
              transitionSpeed={2500} 
              className="rounded-xl border border-border/50 bg-background/50 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-sm"
              glareEnable={true}
              glareMaxOpacity={0.15}
              glareColor="#ffffff"
              glarePosition="all"
            >
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-muted/40">
                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <div className="h-3 w-3 rounded-full bg-green-500/80" />
                <div className="ml-4 flex-1 bg-background/60 rounded-md px-3 py-1 text-xs text-muted-foreground/70 text-left font-mono backdrop-blur-md">
                  tradetracker.app/dashboard
                </div>
              </div>
              <img
                src="/screenshots/dashboard.png"
                alt="TradeTracker Main Dashboard"
                className="w-full object-cover object-top opacity-95"
              />
            </Tilt>
            <div className="absolute -bottom-10 left-0 right-0 h-48 bg-gradient-to-t from-background to-transparent z-20 pointer-events-none" />
          </motion.div>
        </section>

        {/* Infinite Asset Marquee */}
        <div className="w-full overflow-hidden py-10 bg-muted/20 border-y border-border">
          <motion.div 
            animate={{ x: [0, -1000] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="flex whitespace-nowrap gap-16 items-center text-muted-foreground/60 text-2xl font-bold uppercase tracking-widest"
          >
            {/* Duplicated to create seamless loop */}
            <span>Forex</span><span>•</span><span>Crypto</span><span>•</span><span>Equities</span><span>•</span><span>Indices</span><span>•</span><span>Commodities</span><span>•</span><span>Futures</span><span>•</span>
            <span>Forex</span><span>•</span><span>Crypto</span><span>•</span><span>Equities</span><span>•</span><span>Indices</span><span>•</span><span>Commodities</span><span>•</span><span>Futures</span><span>•</span>
            <span>Forex</span><span>•</span><span>Crypto</span><span>•</span><span>Equities</span><span>•</span><span>Indices</span><span>•</span><span>Commodities</span><span>•</span><span>Futures</span><span>•</span>
          </motion.div>
        </div>

        {/* Detailed Dashboard Section */}
        <section className="py-32 px-6 border-b border-border bg-background relative">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={FADE_UP}
              className="order-2 lg:order-1 relative perspective-[1000px]"
            >
              <Tilt tiltMaxAngleX={3} tiltMaxAngleY={3} scale={1.02} transitionSpeed={2000}>
                <div className="rounded-2xl border border-border/60 bg-muted/20 overflow-hidden shadow-2xl relative group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <img src="/screenshots/dashboard2.png" alt="Detailed Dashboard Analytics" className="w-full object-cover" />
                </div>
              </Tilt>
            </motion.div>
            
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
              className="order-1 lg:order-2 space-y-6"
            >
              <motion.div variants={FADE_UP} className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-primary/10 text-primary text-sm font-bold tracking-wide">
                <BarChart className="h-4 w-4" />
                COMMAND CENTER
              </motion.div>
              <motion.h2 variants={FADE_UP} className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight">
                Your entire trading <br/>portfolio at a glance.
              </motion.h2>
              <motion.p variants={FADE_UP} className="text-lg text-muted-foreground leading-relaxed">
                Experience a radically transparent view of your trading history. Our secondary dashboard deep-dives into your metrics, exposing your profit factors, consecutive drawdown periods, and daily P&L distributions. By visualizing your performance over time, you can easily identify market hours that yield the highest returns and the assets that drain your account.
              </motion.p>
              <motion.ul variants={FADE_UP} className="space-y-4 pt-4">
                {[
                  "Real-time equity curve visualization",
                  "Asset-class performance breakdown",
                  "Daily and weekly consistency tracking",
                  "Automated risk-to-reward profiling"
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-muted-foreground font-medium">
                    <div className="h-2 w-2 rounded-full bg-primary shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                    {item}
                  </li>
                ))}
              </motion.ul>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-32 px-6 border-b border-border bg-muted/10">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={FADE_UP}
              className="text-center mb-20 space-y-6"
            >
              <p className="text-sm font-bold text-primary uppercase tracking-[0.2em]">Platform Capabilities</p>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">Everything a pro needs</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Stop guessing why you're losing and start measuring what actually works. TradeTracker transforms your raw trade execution data into a highly structured, actionable database of insights.
              </p>
            </motion.div>

            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} 
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {[
                { title: "Live P&L & Metrics", description: "Monitor your profit, loss, and precise R:R ratios calculated in absolute real-time before you even formally submit it to your journal.", icon: LineChart },
                { title: "Psychological Tracking", description: "Trading is 80% psychology. Tag every single trade with your emotional state—whether Confident or suffering from FOMO. We'll cross-reference your emotions with profitability.", icon: Brain },
                { title: "Strategy Journaling", description: "Move beyond messy spreadsheets. Define explicit strategies with strict entry/exit conditions, and journal every execution to track adherence.", icon: Book },
                { title: "Win Rate & Streaks", description: "Instantly know your precise win rate, current consecutive win/loss streaks, and overarching profit factor. Our algorithms crunch the numbers.", icon: Target },
                { title: "Risk Profiling", description: "Document your exact stop loss, take profit, and precise capital amount risked on every trade. Build an impenetrable wall of discipline.", icon: Shield },
                { title: "Universal Asset Support", description: "Whether you scalp Forex, swing trade Crypto, or trade Futures and Options—our platform adapts to log trades across any global market.", icon: Globe },
              ].map((feature, i) => (
                <motion.div
                  key={feature.title}
                  variants={FADE_UP}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className="p-8 rounded-3xl border border-border/60 bg-background hover:bg-muted/40 transition-colors duration-300 space-y-5 shadow-sm hover:shadow-2xl hover:shadow-primary/5 group"
                >
                  <div className="h-14 w-14 rounded-2xl bg-muted border border-border flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary/10 group-hover:border-primary/30 transition-all duration-300">
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold tracking-tight">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* AI Feature Section */}
        <section className="py-32 px-6 border-b border-border bg-background relative overflow-hidden">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" 
          />
          
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
              className="space-y-6"
            >
              <motion.div variants={FADE_UP} className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primary text-sm font-bold tracking-wide">
                <Sparkles className="h-4 w-4" />
                AI POWERED (LLAMA 3.3)
              </motion.div>
              <motion.h2 variants={FADE_UP} className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight">
                Your personal AI <br/>Trading Coach.
              </motion.h2>
              <motion.p variants={FADE_UP} className="text-lg text-muted-foreground leading-relaxed">
                Meet the future of trade analysis. Our integrated AI coach continuously scans your historical trade data, looking for hidden patterns that human eyes miss. It automatically identifies your biggest weaknesses—like revenge trading on Fridays or closing winning trades too early—and generates actionable, personalized advice to fix your leaks.
              </motion.p>
              <motion.div variants={FADE_UP} className="pt-4">
                <div className="relative p-6 rounded-2xl bg-muted/30 border border-border/50 overflow-hidden backdrop-blur-sm group">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <p className="text-sm font-medium italic leading-relaxed relative z-10 text-foreground/90">
                    "You have a 78% win rate when holding EUR/USD for more than 4 hours, but your win rate drops to 32% when you scalp it under 15 minutes. Consider sticking to higher timeframes."
                  </p>
                  <div className="flex items-center gap-2 mt-4 relative z-10">
                    <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <Sparkles className="h-3 w-3 text-primary" />
                    </div>
                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-widest">— AI Coach Insight</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={FADE_UP}
              className="relative perspective-[1000px]"
            >
              <Tilt tiltMaxAngleX={4} tiltMaxAngleY={4} scale={1.03} transitionSpeed={2000}>
                <div className="rounded-2xl border border-border/50 bg-background/50 overflow-hidden shadow-[0_0_40px_rgba(16,185,129,0.1)] backdrop-blur-md">
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-muted/40">
                    <div className="h-3 w-3 rounded-full bg-red-500/80" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                    <div className="h-3 w-3 rounded-full bg-green-500/80" />
                  </div>
                  <img src="/screenshots/ai-feature.png" alt="AI Trading Coach Interface" className="w-full object-cover" />
                </div>
              </Tilt>
            </motion.div>
          </div>
        </section>

        {/* Trade Journal Section */}
        <section className="py-32 px-6 border-b border-border bg-muted/10">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={FADE_UP}
              className="order-2 lg:order-1 relative perspective-[1000px]"
            >
              <Tilt tiltMaxAngleX={3} tiltMaxAngleY={3} scale={1.02} transitionSpeed={2000}>
                <div className="rounded-2xl border border-border/60 bg-background overflow-hidden shadow-2xl">
                  <img src="/screenshots/trades.png" alt="TradeTracker Trade Journal" className="w-full object-cover object-top opacity-90 hover:opacity-100 transition-opacity" />
                </div>
              </Tilt>
            </motion.div>

            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
              className="order-1 lg:order-2 space-y-6"
            >
              <motion.p variants={FADE_UP} className="text-sm font-bold text-primary uppercase tracking-[0.2em]">Flawless Logging</motion.p>
              <motion.h2 variants={FADE_UP} className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight">
                Log trades exactly the way
                <span className="text-muted-foreground block mt-2">pros actually do.</span>
              </motion.h2>
              <motion.p variants={FADE_UP} className="text-lg text-muted-foreground leading-relaxed">
                We've obsessively engineered the trade logging experience to be as frictionless and comprehensive as possible. Every detail matters: capture your exact entry price, exit price, lot sizes, stop losses, take profits, total capital invested, your emotional state, and extensive pre/post-trade notes.
              </motion.p>
              <motion.ul variants={FADE_UP} className="space-y-4 pt-4">
                {[
                  "Instantly auto-calculated P&L and Risk-to-Reward ratio",
                  "Mandatory emotional state tagging to build psychological awareness",
                  "Seamless management between open, pending, and closed trades",
                  "One-click CSV imports from major brokerages and exchanges",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-4 text-muted-foreground font-medium bg-background border border-border/50 p-4 rounded-xl shadow-sm">
                    <span className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold border border-primary/20">✓</span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </motion.ul>
            </motion.div>
          </div>
        </section>

        {/* Analytics & Reports Section */}
        <section className="py-32 px-6 border-b border-border bg-background relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-muted/30 to-transparent pointer-events-none" />
          
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
            className="max-w-6xl mx-auto text-center space-y-6 mb-20 relative z-10"
          >
            <motion.h2 variants={FADE_UP} className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">Deep Analytics & Reporting</motion.h2>
            <motion.p variants={FADE_UP} className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Visualizing data is the key to understanding it. Generate high-fidelity charts of your trading history and export beautiful, professional PDF reports to share with investors, mentors, or for your own permanent records.
            </motion.p>
          </motion.div>
          
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={FADE_UP}
            >
              <Tilt tiltMaxAngleX={2} tiltMaxAngleY={2} scale={1.01} transitionSpeed={2500}>
                <div className="rounded-3xl border border-border/80 bg-muted/10 overflow-hidden shadow-2xl p-3 h-full flex flex-col group hover:bg-muted/20 transition-colors">
                  <div className="overflow-hidden rounded-2xl border border-border/50">
                    <img src="/screenshots/charts1.png" alt="Advanced Trade Charting" className="w-full h-auto group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="p-8 flex-1 flex flex-col justify-end">
                    <h3 className="text-2xl font-bold mb-3 flex items-center gap-2"><LineChart className="h-6 w-6 text-primary" /> Granular Visualizations</h3>
                    <p className="text-muted-foreground leading-relaxed">Slice and dice your data. Compare your performance across different days of the week, different assets, and various timeframes to pinpoint your most lucrative setups.</p>
                  </div>
                </div>
              </Tilt>
            </motion.div>

            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={FADE_UP}
            >
              <Tilt tiltMaxAngleX={2} tiltMaxAngleY={2} scale={1.01} transitionSpeed={2500}>
                <div className="rounded-3xl border border-border/80 bg-muted/10 overflow-hidden shadow-2xl p-3 h-full flex flex-col group hover:bg-muted/20 transition-colors">
                  <div className="overflow-hidden rounded-2xl border border-border/50 bg-background flex items-center justify-center p-4">
                    <img src="/screenshots/reports.png" alt="Automated PDF Reporting" className="w-full h-auto shadow-md rounded-xl group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="p-8 flex-1 flex flex-col justify-end">
                    <h3 className="text-2xl font-bold mb-3 flex items-center gap-2"><FileText className="h-6 w-6 text-primary" /> Professional PDF Export</h3>
                    <p className="text-muted-foreground leading-relaxed">Instantly compile your trading history, key metrics, and equity curves into a sleek, branded PDF document. Perfect for funding evaluations or prop firm reviews.</p>
                  </div>
                </div>
              </Tilt>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-40 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-background" />
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-primary rounded-full blur-[200px] pointer-events-none" 
          />
          
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
            className="relative z-10 max-w-4xl mx-auto text-center space-y-10"
          >
            <motion.h2 variants={FADE_UP} className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
              Ready to trade with <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-300">absolute clarity?</span>
            </motion.h2>
            <motion.p variants={FADE_UP} className="text-xl sm:text-2xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Join thousands of disciplined traders who have stopped gambling and started treating their trading like a data-driven business.
            </motion.p>
            <motion.div variants={FADE_UP} className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
              <Button asChild size="lg" className="w-full sm:w-auto px-12 h-16 text-lg rounded-full shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_50px_rgba(16,185,129,0.5)] hover:-translate-y-1 transition-all duration-300">
                <Link href="/signup">Create Your Free Account <ChevronRight className="ml-2 h-5 w-5" /></Link>
              </Button>
            </motion.div>
            <motion.p variants={FADE_UP} className="text-sm text-muted-foreground opacity-80 pt-4">
              Setup takes less than 2 minutes. No credit card required.
            </motion.p>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border px-8 py-12 bg-background relative z-10">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3 opacity-90">
              <img src="/tradetracker-icon.svg" alt="TradeTracker Logo" className="h-8 w-8" />
              <span className="font-bold text-xl tracking-tight">TradeTracker</span>
            </div>
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {new Date().getFullYear()} TradeTracker Platform. Engineered for traders who take their edge seriously.
            </p>
            <div className="flex items-center gap-8 text-sm font-medium text-muted-foreground">
              <Link href="/login" className="hover:text-primary transition-colors">Login</Link>
              <Link href="/signup" className="hover:text-primary transition-colors">Sign Up</Link>
            </div>
          </div>
        </footer>

      </div>
    </ThemeProvider>
  )
}