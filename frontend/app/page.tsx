// app/page.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button'; // Assuming you have this
import { ThemeProvider } from '@/components/theme-provider';

export default function LandingPage() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <h1 className="text-5xl font-bold mb-6">Welcome to TradeTracker</h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
        The ultimate platform to track your trades, analyze performance, and get AI-driven feedback to elevate your trading game.
      </p>
      <div className="space-x-4">
        <Button asChild size="lg">
          <Link href="/signup">Get Started</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/login">Login</Link>
        </Button>
      </div>
      <p className="mt-12 text-sm text-muted-foreground">
        Already have an account? <Link href="/login" className="underline hover:text-primary">Sign in here</Link>.
      </p>
      {/* You can add more marketing content, feature highlights, etc. */}
    </div>
    </ThemeProvider>
  );
}