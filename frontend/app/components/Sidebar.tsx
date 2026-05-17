"use client"

import { useState } from "react"
import Link from "next/link"
import { Home, BarChart2, Settings, Menu, TrendingUp, FileText, NotebookPen, User, ChevronLeft, ChevronRight, Brain, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { clearToken } from "@/app/lib/api"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Trades", href: "/dashboard/trades", icon: BarChart2 },
  { name: "Strategies", href: "/dashboard/strategies", icon: NotebookPen },
  { name: "AI Coach", href: "/dashboard/ai", icon: Brain },
  { name: "Report", href: "/report", icon: FileText },
  { name: "Profile", href: "/profile", icon: User },
]

export default function Sidebar() {
  const [open, setOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const router = useRouter()

  const handleSignOut = () => {
    clearToken()
    router.push("/login")
  }

  // Avoid creating inner components to prevent DOM unmounting on state change
  const renderContent = (isMobile: boolean) => (
    <div className="flex flex-col h-full relative">
      <div className={`p-4 flex ${isCollapsed && !isMobile ? "flex-col items-center gap-4 mt-2" : "items-center justify-between"} min-h-[4rem] transition-all`}>
        {(!isCollapsed || isMobile) ? (
          <img 
            src="/tradetracker-full.svg" 
            alt="TradeTracker" 
            className="h-7 w-auto object-contain"
          />
        ) : (
          <img 
            src="/tradetracker-icon.svg" 
            alt="TT" 
            className="h-8 w-8 object-contain"
          />
        )}
        
        {!isMobile && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-muted-foreground hover:text-foreground shrink-0"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
        )}
      </div>
      <nav className="flex-1 overflow-hidden mt-2">
        <ul className="space-y-2 p-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <Button 
                variant="ghost" 
                className={`w-full ${isCollapsed && !isMobile ? "justify-center px-0 flex" : "justify-start"}`} 
                asChild 
                onClick={() => setOpen(false)}
              >
                <Link href={item.href} title={isCollapsed ? item.name : undefined}>
                  <item.icon className={`${isCollapsed && !isMobile ? "mr-0" : "mr-3"} h-5 w-5 flex-shrink-0 transition-all`} />
                  <span className={`${isCollapsed && !isMobile ? "hidden" : "block"} whitespace-nowrap`}>
                    {item.name}
                  </span>
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 mt-auto border-t border-border">
        <Button 
          variant="ghost" 
          className={`w-full text-red-500 hover:text-red-600 hover:bg-red-500/10 ${isCollapsed && !isMobile ? "justify-center px-0 flex" : "justify-start"}`} 
          onClick={() => {
            handleSignOut()
            setOpen(false)
          }}
        >
          <LogOut className={`${isCollapsed && !isMobile ? "mr-0" : "mr-3"} h-5 w-5 flex-shrink-0 transition-all`} />
          <span className={`${isCollapsed && !isMobile ? "hidden" : "block"} whitespace-nowrap`}>
            Sign Out
          </span>
        </Button>
      </div>
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
          {renderContent(true)}
        </SheetContent>
      </Sheet>
      
      {/* Desktop Sidebar */}
      <div 
        className={`hidden lg:flex bg-card text-card-foreground border-r border-border flex-col transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-16" : "w-64"
        }`}
      >
        {renderContent(false)}
      </div>
    </>
  )
}

