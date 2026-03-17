export interface StrategyType {
  id: string;
  name: string;
  description: string;
  assetClasses: string[];
  indicatorsUsed: string;
  timeframes: string;
  entryRules: string;
  exitRules: string;
  riskManagement: string;
  // notes?: string; // This might be part of the strategy object or fetched separately
  userId: string; // Assuming strategies are user-specific
  createdAt: Date;
  updatedAt: Date;
}