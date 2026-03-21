"use client";

import { useState, FormEvent } from "react";
import { apiFetch } from "../../../../lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Save, Trash2 } from "lucide-react";

interface StrategyDetails {
  id: string;
  name: string;
  description: string;
  assetClasses: string[];
  indicatorsUsed: string;
  timeframes: string;
  entryRules: string;
  exitRules: string;
  riskManagement: string;
}

interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  mood?: string;
  lessons?: string;
}

interface StrategyJournalTabsProps {
  strategyDetails: StrategyDetails;
  initialJournalEntries: JournalEntry[];
  initialNotes: string;
  strategyId: string;
}

const emptyForm = {
  title: "",
  content: "",
  mood: "",
  lessons: "",
};

export function StrategyJournalTabs({
  strategyDetails,
  initialJournalEntries,
  initialNotes,
  strategyId,
}: StrategyJournalTabsProps) {
  const [notes, setNotes] = useState<string>(initialNotes || "");
  const [notesSaved, setNotesSaved] = useState(false);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(initialJournalEntries || []);
  const [forms, setForms] = useState([{ ...emptyForm, id: Date.now() }]);
  const [showForms, setShowForms] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSaveNotes = async () => {
    try {
      await apiFetch(`/api/strategies/${strategyId}/notes`, {
        method: "PUT",
        body: JSON.stringify({ notes }),
      });
      setNotesSaved(true);
      setTimeout(() => setNotesSaved(false), 2000);
    } catch (err) {
      console.error("Error saving notes:", err);
    }
  };

  const addForm = () => {
    setForms((prev) => [...prev, { ...emptyForm, id: Date.now() }]);
  };

  const removeForm = (id: number) => {
    setForms((prev) => prev.filter((f) => f.id !== id));
  };

  const updateForm = (id: number, field: string, value: string) => {
    setForms((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [field]: value } : f))
    );
  };

  const handleSubmitAll = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const saved = await Promise.all(
        forms.map((form) =>
          apiFetch(`/api/strategies/${strategyId}/journal`, {
            method: "POST",
            body: JSON.stringify({
              title: form.title,
              content: form.content,
              mood: form.mood,
              lessons: form.lessons,
            }),
          })
        )
      );
      setJournalEntries((prev) => [...saved.reverse(), ...prev]);
      setForms([{ ...emptyForm, id: Date.now() }]);
      setShowForms(false);
    } catch (err) {
      console.error("Error saving journal entries:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Tabs defaultValue="details" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="details">Strategy Details</TabsTrigger>
        <TabsTrigger value="journal">Trade Journal</TabsTrigger>
        <TabsTrigger value="notes">General Notes</TabsTrigger>
      </TabsList>

      {/* Tab 1: Strategy Details */}
      <TabsContent value="details" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Strategy Definition</CardTitle>
            <CardDescription>The core rules and parameters of this strategy.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(strategyDetails).map(([key, value]) => {
              if (key === "id" || key === "name" || key === "description") return null;
              const label = key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
              return (
                <div key={key}>
                  <h4 className="font-semibold text-sm">{label}:</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {Array.isArray(value) ? value.join(", ") : String(value)}
                  </p>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </TabsContent>

      {/* Tab 2: Trade Journal */}
      <TabsContent value="journal" className="mt-4 space-y-4">
        <div className="flex justify-end">
          <Button
            onClick={() => {
              setShowForms(!showForms);
              if (!showForms) setForms([{ ...emptyForm, id: Date.now() }]);
            }}
            variant="outline"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            {showForms ? "Cancel" : "New Journal Entry"}
          </Button>
        </div>

        {showForms && (
          <form onSubmit={handleSubmitAll} className="space-y-4">
            {forms.map((form, index) => (
              <Card key={form.id}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-base">Entry {index + 1}</CardTitle>
                  {forms.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeForm(form.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={form.title}
                      onChange={(e) => updateForm(form.id, "title", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label>Content / Observations</Label>
                    <Textarea
                      value={form.content}
                      onChange={(e) => updateForm(form.id, "content", e.target.value)}
                      rows={4}
                      required
                      placeholder="Describe the trade, setup, execution, outcome..."
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Mood / Emotions</Label>
                      <Input
                        value={form.mood}
                        onChange={(e) => updateForm(form.id, "mood", e.target.value)}
                        placeholder="e.g., Confident, Anxious, FOMO"
                      />
                    </div>
                    <div>
                      <Label>Lessons Learned</Label>
                      <Input
                        value={form.lessons}
                        onChange={(e) => updateForm(form.id, "lessons", e.target.value)}
                        placeholder="What did you learn?"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="flex items-center justify-between">
              <Button type="button" variant="outline" onClick={addForm}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Another Entry
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : `Save ${forms.length > 1 ? `${forms.length} Entries` : "Entry"}`}
              </Button>
            </div>
          </form>
        )}

        {journalEntries.length === 0 && !showForms ? (
          <p className="text-muted-foreground text-center py-4">
            No journal entries for this strategy yet.
          </p>
        ) : (
          <div className="space-y-4">
            {journalEntries.map((entry) => (
              <Card key={entry.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{entry.title}</CardTitle>
                  <CardDescription>{new Date(entry.date).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="whitespace-pre-wrap">{entry.content}</p>
                  {entry.mood && (
                    <p className="text-sm">
                      <strong>Mood:</strong> {entry.mood}
                    </p>
                  )}
                  {entry.lessons && (
                    <p className="text-sm">
                      <strong>Lessons:</strong> {entry.lessons}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>

      {/* Tab 3: General Notes */}
      <TabsContent value="notes" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Strategy Notes</CardTitle>
            <CardDescription>
              General observations, ideas, or backtesting notes for this strategy.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={10}
              placeholder="Keep track of your thoughts, adjustments, and performance insights here..."
            />
            <div className="flex justify-end">
              <Button onClick={handleSaveNotes}>
                <Save className="mr-2 h-4 w-4" />
                {notesSaved ? "Saved!" : "Save Notes"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}