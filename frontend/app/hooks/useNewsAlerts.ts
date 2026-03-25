"use client";

import { useEffect, useRef } from "react";
import { getNews } from "../lib/api";
// Note: Depending on what toast library the project uses, we will import it.
// Assuming sonner or similar is available given previous UI patterns, or native alert.
// But checking the codebase, they use a custom or radical standard. I will use standard browser Notifications 
// if granted, or fallback to a custom global state/alert. For now, I'll log and use `alert` if no toast is found, 
// or maybe check what toast library exists. 
import { useToast } from "@/components/ui/use-toast";

export type NewsEvent = {
  title: string;
  country: string;
  date: string;
  impact: string;
  forecast: string;
  previous: string;
};

export function useNewsAlerts() {
  const { toast } = useToast();
  // Keep track of alerted events to prevent repeating
  const alertedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const checkNews = async () => {
      try {
        const events: NewsEvent[] = await getNews();
        if (!events || !events.length) return;

        const now = new Date().getTime();

        events.forEach((event) => {
          if (event.impact !== 'High') return; // Only alert for High impact
          
          const eventTime = new Date(event.date).getTime();
          const timeDiffMinutes = (eventTime - now) / (1000 * 60);

          // If the event is between 0 and 16 minutes away and we haven't alerted yet
          if (timeDiffMinutes > 0 && timeDiffMinutes <= 16 && !alertedRef.current.has(event.title + event.date)) {
            alertedRef.current.add(event.title + event.date);
            
            toast({
              title: `⚠️ High Volatility Warning: ${event.country}`,
              description: `${event.title} is releasing in ${Math.round(timeDiffMinutes)} minutes!`,
              variant: "destructive",
            });
          }
        });
      } catch (err) {
        console.error("Failed to check news alerts", err);
      }
    };

    // Check immediately on mount
    checkNews();
    
    // Check every 5 minutes
    interval = setInterval(checkNews, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [toast]);
}
