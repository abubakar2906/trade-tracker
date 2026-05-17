// app/(main)/layout.tsx
import { ThemeProvider } from "@/components/theme-provider"
import Sidebar from "../components/Sidebar"
import { NewsAlertsProvider } from "../components/NewsAlertsProvider"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <NewsAlertsProvider />
      <div className="flex flex-col lg:flex-row h-screen bg-background overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">{children}</main>
      </div>
    </ThemeProvider>
  )
}