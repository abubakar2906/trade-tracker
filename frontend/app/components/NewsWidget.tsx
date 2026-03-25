"use client";

import { useEffect, useState } from "react";
import { getNews } from "../lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, AlertTriangle, Info } from "lucide-react";

export type NewsEvent = {
  title: string;
  country: string;
  date: string;
  impact: string;
  forecast: string;
  previous: string;
};

export function NewsWidget() {
  const [news, setNews] = useState<NewsEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await getNews();
        // Filter out past events for today, or keep them to show what happened today.
        // Let's only show upcoming events or events for the next 24 hours.
        const now = new Date();
        const upcoming = data.filter((e: NewsEvent) => new Date(e.date) > now).slice(0, 5);
        setNews(upcoming);
      } catch (err) {
        console.error("Failed to fetch news", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-primary" />
          Upcoming High-Impact News
        </CardTitle>
        <CardDescription>Major economic events to watch out for.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading calendar...</p>
        ) : news.length === 0 ? (
          <p className="text-sm text-muted-foreground">No high-impact news upcoming today.</p>
        ) : (
          <div className="space-y-4">
            {news.map((n, i) => {
              const dateObj = new Date(n.date);
              const isToday = dateObj.toDateString() === new Date().toDateString();
              const displayDate = isToday 
                ? `Today at ${dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` 
                : dateObj.toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
              
              const isHigh = n.impact === 'High';

              return (
                <div key={i} className="flex justify-between items-start border-b border-border/50 last:border-0 pb-3 last:pb-0">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{n.country}</span>
                      <Badge variant="outline" className={`text-xs ${isHigh ? 'border-destructive text-destructive bg-destructive/10' : 'border-orange-500 text-orange-600 bg-orange-500/10'}`}>
                        {n.impact}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium">{n.title}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      {isHigh ? <AlertTriangle className="w-3 h-3" /> : <Info className="w-3 h-3" />}
                      {displayDate}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
