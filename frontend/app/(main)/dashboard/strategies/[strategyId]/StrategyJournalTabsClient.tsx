// app/dashboard/strategies/[strategyId]/StrategyJournalTabsClient.tsx
"use client"; // This directive is ESSENTIAL. It marks this as a Client Component.

import { useState, FormEvent } from "react"; // React hooks for state and event types

// Correct imports for Shadcn UI components and lucide-react icons
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Save } from "lucide-react";

// --- Type Definitions (Ideally, these would come from @/types/*) ---
interface StrategyDetails {
  id: string;
  name: string; // Name and description are displayed by the parent Server Component
  description: string; // but can be useful here too if needed for other logic.
  assetClasses: string[];
  indicatorsUsed: string;
  timeframes: string;
  entryRules: string;
  exitRules: string;
  riskManagement: string;
  // Note: The 'notes' field for the strategy itself is handled by the 'initialNotes' prop
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
  strategyDetails: StrategyDetails; // Details of the strategy, fetched by the server
  initialJournalEntries: JournalEntry[]; // Journal entries, fetched by the server
  initialNotes: string; // General notes for the strategy, fetched by the server
  strategyId: string; // The ID of the current strategy, needed for API calls
}

/**
 * StrategyJournalTabsClient Component
 *
 * This is a Client Component responsible for rendering the interactive tabs
 * for strategy details, journaling, and general notes.
 * It handles form state, user input, and API calls for saving notes and journal entries.
 */
export function StrategyJournalTabs({
  strategyDetails,
  initialJournalEntries,
  initialNotes,
  strategyId,
}: StrategyJournalTabsProps) {
  // State for the general strategy notes text area
  const [notes, setNotes] = useState<string>(initialNotes || "");

  // State for the list of journal entries
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(initialJournalEntries || []);

  // State for the new journal entry form
  const [newJournalTitle, setNewJournalTitle] = useState<string>("");
  const [newJournalContent, setNewJournalContent] = useState<string>("");
  const [newJournalMood, setNewJournalMood] = useState<string>("");
  const [newJournalLessons, setNewJournalLessons] = useState<string>("");
  const [showNewJournalForm, setShowNewJournalForm] = useState<boolean>(false);

  /**
   * Handles saving the general strategy notes.
   * This would typically make an API call.
   */
  const handleSaveNotes = async () => {
    console.log(`Client: Attempting to save notes for strategy ${strategyId}:`, notes);
    // TODO: Implement actual API call to save notes, e.g.:
    // try {
    //   const response = await fetch(`/api/strategies/${strategyId}/notes`, {
    //     method: 'PUT',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ notes }),
    //   });
    //   if (!response.ok) throw new Error('Failed to save notes');
    //   // Show success toast
    // } catch (error) {
    //   console.error("Error saving notes:", error);
    //   // Show error toast
    // }
  };

  /**
   * Handles adding a new journal entry.
   * This would typically make an API call.
   */
  const handleAddJournalEntry = async (e: FormEvent) => {
    e.preventDefault();
    const newEntry: JournalEntry = {
      id: `temp_j_${Date.now()}`, // Use a temporary ID for client-side rendering
      date: new Date().toISOString().split('T')[0],
      title: newJournalTitle,
      content: newJournalContent,
      mood: newJournalMood,
      lessons: newJournalLessons,
    };

    console.log(`Client: Attempting to add journal entry for strategy ${strategyId}:`, newEntry);
    // TODO: Implement actual API call to save journal entry, e.g.:
    // try {
    //   const response = await fetch(`/api/strategies/${strategyId}/journal`, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(newEntry), // Send newEntry without temp ID, backend assigns real ID
    //   });
    //   if (!response.ok) throw new Error('Failed to add journal entry');
    //   const savedEntry = await response.json(); // Assuming backend returns the saved entry with real ID
    //   setJournalEntries(prev => [savedEntry, ...prev]);
    // } catch (error) {
    //   console.error("Error adding journal entry:", error);
    //   // Show error toast
    //   return; // Don't clear form if save failed
    // }

    // Optimistic update for now (or after successful API call)
    setJournalEntries(prev => [newEntry, ...prev]);

    // Clear the form fields
    setNewJournalTitle("");
    setNewJournalContent("");
    setNewJournalMood("");
    setNewJournalLessons("");
    setShowNewJournalForm(false);
  };

  return (
    <Tabs defaultValue="details" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="details">Strategy Details</TabsTrigger>
        <TabsTrigger value="journal">Trade Journal</TabsTrigger>
        <TabsTrigger value="notes">General Notes</TabsTrigger>
      </TabsList>

      {/* Tab 1: Strategy Details - Displaying data passed from server */}
      <TabsContent value="details" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Strategy Definition</CardTitle>
            <CardDescription>The core rules and parameters of this strategy.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Iterate over strategyDetails prop */}
            {Object.entries(strategyDetails).map(([key, value]) => {
              // Skip id, name, description as they are usually displayed by the parent page
              if (key === 'id' || key === 'name' || key === 'description') return null;
              
              // Simple way to format the key as a label
              const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
              
              return (
                <div key={key}>
                  <h4 className="font-semibold text-sm">{label}:</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {Array.isArray(value) ? value.join(', ') : String(value)}
                  </p>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </TabsContent>

      {/* Tab 2: Trade Journal - Interactive form and list */}
      <TabsContent value="journal" className="mt-4 space-y-4">
        <div className="flex justify-end">
          <Button onClick={() => setShowNewJournalForm(!showNewJournalForm)} variant="outline">
            <PlusCircle className="mr-2 h-4 w-4" /> {showNewJournalForm ? "Cancel" : "New Journal Entry"}
          </Button>
        </div>

        {showNewJournalForm && (
          <Card>
            <CardHeader><CardTitle>New Journal Entry</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleAddJournalEntry} className="space-y-4">
                <div>
                  <Label htmlFor="journalTitle">Title</Label>
                  <Input id="journalTitle" value={newJournalTitle} onChange={(e) => setNewJournalTitle(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="journalContent">Content / Observations</Label>
                  <Textarea id="journalContent" value={newJournalContent} onChange={(e) => setNewJournalContent(e.target.value)} rows={5} required placeholder="Describe the trade, setup, execution, outcome..." />
                </div>
                <div>
                  <Label htmlFor="journalMood">Mood / Emotions</Label>
                  <Input id="journalMood" value={newJournalMood} onChange={(e) => setNewJournalMood(e.target.value)} placeholder="e.g., Confident, Anxious, FOMO" />
                </div>
                <div>
                  <Label htmlFor="journalLessons">Lessons Learned</Label>
                  <Textarea id="journalLessons" value={newJournalLessons} onChange={(e) => setNewJournalLessons(e.target.value)} rows={3} placeholder="What did you learn from this trade or day?" />
                </div>
                <Button type="submit">Add Entry</Button>
              </form>
            </CardContent>
          </Card>
        )}

        {journalEntries.length === 0 && !showNewJournalForm ? (
          <p className="text-muted-foreground text-center py-4">No journal entries for this strategy yet.</p>
        ) : (
          journalEntries.map((entry) => (
            <Card key={entry.id}>
              <CardHeader>
                <CardTitle className="text-lg">{entry.title}</CardTitle>
                <CardDescription>{new Date(entry.date).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="whitespace-pre-wrap">{entry.content}</p>
                {entry.mood && <p className="text-sm"><strong>Mood:</strong> {entry.mood}</p>}
                {entry.lessons && <p className="text-sm"><strong>Lessons:</strong> {entry.lessons}</p>}
              </CardContent>
            </Card>
          ))
        )}
      </TabsContent>

      {/* Tab 3: General Notes - Interactive textarea */}
      <TabsContent value="notes" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Strategy Notes</CardTitle>
            <CardDescription>General observations, ideas, or backtesting notes for this strategy.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={10}
              placeholder="Keep track of your thoughts, adjustments, and performance insights here..."
            />
            <div className="flex justify-end">
              <Button onClick={handleSaveNotes}><Save className="mr-2 h-4 w-4" /> Save Notes</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}