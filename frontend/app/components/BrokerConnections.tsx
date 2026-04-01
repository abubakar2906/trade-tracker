"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Server, RefreshCw, Trash2, Plus, AlertCircle } from "lucide-react";
import { getBrokerAccounts, connectBrokerAccount, syncBrokerAccount, deleteBrokerAccount } from "../lib/api";

export function BrokerConnections() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    accountId: "",
    password: "",
    brokerServer: "",
    platform: "mt5",
  });

  const fetchAccounts = async () => {
    try {
      const data = await getBrokerAccounts();
      setAccounts(data);
    } catch (err) {
      console.error("Failed to fetch broker accounts", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsConnecting(true);

    try {
      await connectBrokerAccount(formData);
      await fetchAccounts();
      setIsDialogOpen(false);
      setFormData({ name: "", accountId: "", password: "", brokerServer: "", platform: "mt5" });
    } catch (err: any) {
      setError(err.message || "Failed to connect broker. Check credentials.");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSync = async (id: string) => {
    setSyncingId(id);
    try {
      const res = await syncBrokerAccount(id);
      alert(res.message);
      await fetchAccounts(); // refresh last sync time
    } catch (err: any) {
      alert("Sync failed: " + (err.message || "Unknown error"));
    } finally {
      setSyncingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to disconnect this broker? Your logged trades will remain.")) return;
    try {
      await deleteBrokerAccount(id);
      await fetchAccounts();
    } catch (err: any) {
      alert("Delete failed: " + (err.message || "Unknown error"));
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-base flex items-center gap-2">
            <Server className="w-5 h-5 text-primary" />
            Broker Sync
          </CardTitle>
          <CardDescription>Connect MT4/MT5 accounts to auto-sync your trades.</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Connect Broker
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Connect Broker Account</DialogTitle>
              <DialogDescription>
                Enter your read-only investor password to securely sync trades.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleConnect} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Connection Name (Optional)</Label>
                <Input id="name" name="name" placeholder="e.g. My FTMO Account" value={formData.name} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brokerServer">Broker Server</Label>
                <Input id="brokerServer" name="brokerServer" required placeholder="e.g. MetaQuotes-Demo" value={formData.brokerServer} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountId">Account Login (ID)</Label>
                <Input id="accountId" name="accountId" required placeholder="e.g. 12345678" value={formData.accountId} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Investor Password</Label>
                <Input id="password" type="password" name="password" required placeholder="Enter read-only password" value={formData.password} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="platform">Platform</Label>
                <select 
                  id="platform" 
                  name="platform" 
                  value={formData.platform} 
                  onChange={handleChange}
                  className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="mt5">MetaTrader 5</option>
                  <option value="mt4">MetaTrader 4</option>
                </select>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-2 rounded">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <DialogFooter>
                <Button type="submit" disabled={isConnecting} className="w-full">
                  {isConnecting ? "Connecting (may take up to 60s)..." : "Connect Account"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading accounts...</p>
        ) : accounts.length === 0 ? (
          <div className="text-center py-6 border rounded-lg border-dashed">
            <p className="text-sm text-muted-foreground">No broker accounts connected.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {accounts.map(acc => (
              <div key={acc.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-sm">{acc.name || `Account ${acc.accountId}`}</h3>
                    <Badge variant={acc.status === "connected" ? "default" : "secondary"}>
                      {acc.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {acc.brokerServer} • {acc.platform.toUpperCase()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Last sync: {acc.lastSync ? new Date(acc.lastSync).toLocaleString() : "Never"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleSync(acc.id)}
                    disabled={syncingId === acc.id}
                    className="gap-2"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${syncingId === acc.id ? "animate-spin" : ""}`} />
                    Sync
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDelete(acc.id)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
