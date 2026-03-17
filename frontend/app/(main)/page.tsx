import TradeForm from "../components/TradeForm"
import TradeList from "../components/TradeList"
import Dashboard from "./dashboard/page"

export default function Home() {
  return (
    // <div className="container mx-auto p-4 sm:p-6 md:p-8">
    //   <h1 className="text-3xl font-bold mb-4">Trade Tracker</h1>
    //   <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
    //     <div>
    //       <TradeForm />
    //     </div>
    //     <div>
    //       <TradeList />
    //     </div>
    //   </div>
    // </div>
    <Dashboard />

  )
}

