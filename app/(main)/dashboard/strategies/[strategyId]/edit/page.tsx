// app/dashboard/strategies/[strategyId]/edit/page.tsx
import StrategyForm from "@/components/ui/StrategyForm";
// TODO: Define StrategyType and fetch strategy by ID
// import { StrategyType } from "@/types/strategy"; 
// import { getStrategyById } from "@/lib/strategies";

export default async function EditStrategyPage({ params }: { params: { strategyId: string } }) {
  // const strategy: StrategyType = await getStrategyById(params.strategyId); // TODO: Implement
  const mockStrategy = { id: params.strategyId, name: "Fetched Strategy Name", description: "Fetched description...", /* other fields */ }; // Mock

  return (
    <div className="space-y-8">
      <StrategyForm initialData={mockStrategy} strategyId={params.strategyId} />
    </div>
  );
}