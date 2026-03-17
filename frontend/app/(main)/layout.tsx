// app/(main)/layout.tsx
// This layout applies to routes within the (main) group, e.g., /dashboard, /trades

// Keep your existing imports like ThemeProvider, Sidebar, Inter font
import "../globals.css"; // Adjust path if globals.css is in root app
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider"; // Assuming path
import Sidebar from "../components/Sidebar"; // Adjust path to your Sidebar component
const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Trade Tracker",
  description: "Track your trades and improve with AI",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <div className="flex flex-col lg:flex-row min-h-screen bg-background">
            <Sidebar />
            <main className="flex-1 p-4 sm:p-6 md:p-8">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

