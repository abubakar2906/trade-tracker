"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  User, Mail, Phone, MapPin, TrendingUp, BarChart2,
  Target, DollarSign, Pencil, X
} from "lucide-react";
import { apiFetch } from "../../lib/api";
import { getTrades } from "../../lib/trades";

const defaultProfile = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
  bio: "",
  tradingStyle: "",
  preferredMarkets: "",
};

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">
          {value || <span className="text-muted-foreground italic">Not set</span>}
        </p>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const [profile, setProfile] = useState(defaultProfile);
  const [draft, setDraft] = useState(defaultProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    totalTrades: 0,
    winRate: 0,
    profitFactor: 0,
    totalProfit: 0,
  });

  useEffect(() => {
    apiFetch("/api/profile")
      .then((data: any) => {
        const p = {
          fullName: data.fullName || "",
          email: data.email || "",
          phone: data.phone || "",
          location: data.location || "",
          bio: data.bio || "",
          tradingStyle: data.tradingStyle || "",
          preferredMarkets: data.preferredMarkets || "",
        };
        setProfile(p);
        setDraft(p);
      })
      .catch(console.error);

    getTrades()
      .then((trades: any[]) => {
        const totalTrades = trades.length;
        let wins = 0;
        let grossProfit = 0;
        let grossLoss = 0;
        let totalProfit = 0;

        trades.forEach((trade) => {
          const pl = Number(trade.profitLoss ?? 0);
          totalProfit += pl;
          if (pl > 0) {
            wins++;
            grossProfit += pl;
          } else {
            grossLoss += Math.abs(pl);
          }
        });

        const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;
        const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? Infinity : 0;

        setStats({ totalTrades, winRate, profitFactor, totalProfit });
      })
      .catch(console.error);
  }, []);

  const initials = profile.fullName
    ? profile.fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDraft((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = () => {
    setDraft(profile);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError("");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    try {
      const updated = await apiFetch("/api/profile", {
        method: "PUT",
        body: JSON.stringify(draft),
      });
      const p = {
        fullName: updated.fullName || "",
        email: updated.email || "",
        phone: updated.phone || "",
        location: updated.location || "",
        bio: updated.bio || "",
        tradingStyle: updated.tradingStyle || "",
        preferredMarkets: updated.preferredMarkets || "",
      };
      setProfile(p);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || "Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  const statCards = [
    { label: "Total Trades", value: stats.totalTrades.toString(), icon: BarChart2 },
    { label: "Win Rate", value: `${stats.winRate.toFixed(1)}%`, icon: Target },
    { label: "Profit Factor", value: isFinite(stats.profitFactor) ? stats.profitFactor.toFixed(2) : "∞", icon: TrendingUp },
    { label: "Total Profit", value: `$${stats.totalProfit.toFixed(2)}`, icon: DollarSign },
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src="" alt={profile.fullName} />
            <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">{profile.fullName || "Your Profile"}</h1>
            <div className="flex items-center gap-2 mt-1">
              {profile.tradingStyle && <Badge variant="secondary">{profile.tradingStyle}</Badge>}
              {profile.preferredMarkets && (
                <span className="text-sm text-muted-foreground">{profile.preferredMarkets}</span>
              )}
            </div>
          </div>
        </div>
        {!isEditing && (
          <Button onClick={handleEdit} variant="outline" className="gap-2">
            <Pencil className="h-4 w-4" />
            Edit Profile
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {isEditing ? (
        <Card>
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
            <CardDescription>Update your personal and trading details.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" name="fullName" value={draft.fullName} onChange={handleChange} placeholder="Your full name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" value={draft.email} onChange={handleChange} placeholder="your@email.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" value={draft.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" name="location" value={draft.location} onChange={handleChange} placeholder="City, Country" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tradingStyle">Trading Style</Label>
                  <Input id="tradingStyle" name="tradingStyle" value={draft.tradingStyle} onChange={handleChange} placeholder="e.g., Day Trading, Swing Trading" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preferredMarkets">Preferred Markets</Label>
                  <Input id="preferredMarkets" name="preferredMarkets" value={draft.preferredMarkets} onChange={handleChange} placeholder="e.g., Crypto, Forex, Stocks" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <textarea
                  id="bio"
                  name="bio"
                  value={draft.bio}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Tell us about yourself..."
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                />
              </div>
              <Separator />
              {error && <p className="text-sm text-destructive">{error}</p>}
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={handleCancel} className="gap-2">
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InfoRow icon={User} label="Full Name" value={profile.fullName} />
              <InfoRow icon={Mail} label="Email" value={profile.email} />
              <InfoRow icon={Phone} label="Phone" value={profile.phone} />
              <InfoRow icon={MapPin} label="Location" value={profile.location} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Trading Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InfoRow icon={TrendingUp} label="Trading Style" value={profile.tradingStyle} />
              <InfoRow icon={BarChart2} label="Preferred Markets" value={profile.preferredMarkets} />
              {profile.bio && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Bio</p>
                    <p className="text-sm">{profile.bio}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}