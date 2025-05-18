"use client"

import { useState } from "react"
import Link from "next/link"
import { Home, BarChart2, PieChart, Settings, Menu, TrendingUp, FileText, NotebookPen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Trades", href: "/dashboard/trades", icon: BarChart2 },
  { name: "Strategies", href: "/dashboard/strategies", icon: NotebookPen },
  { name: "Report", href: "/report", icon: FileText },
]

export default function Sidebar() {
  const [open, setOpen] = useState(false)

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <h1 className="text-2xl font-bold">Trade Tracker</h1>
      </div>
      <nav className="flex-1">
        <ul className="space-y-2 p-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <Button variant="ghost" className="w-full justify-start" asChild onClick={() => setOpen(false)}>
                <Link href={item.href}>
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" className="lg:hidden fixed top-4 left-4 z-40">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
      <div className="hidden lg:flex w-64 bg-card text-card-foreground border-r border-border flex-col">
        <SidebarContent />
      </div>
    </>
  )
}

