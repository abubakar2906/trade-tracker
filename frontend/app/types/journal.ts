export interface JournalEntryType {
  id: string;
  strategyId: string;
  date: string; // Or Date object
  title: string;
  content: string;
  mood?: string;
  lessons?: string;
  // tradeIds?: string[]; // Optional: link to specific trades
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}