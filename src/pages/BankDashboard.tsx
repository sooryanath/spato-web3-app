
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import MetricsCards from "@/components/dashboard/MetricsCards";
import IssueTokensForm from "@/components/dashboard/IssueTokensForm";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import { Web3Provider } from "@/contexts/Web3Context";
import { TokenHistoryProvider } from "@/contexts/TokenHistoryContext";

const BankDashboard = () => {
  return (
    <Web3Provider>
      <TokenHistoryProvider>
        <div className="min-h-screen bg-gray-50">
          <DashboardHeader userType="Bank" userName="HDFC Bank" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Bank Dashboard</h1>
              <p className="text-gray-600">Manage CAT token issuance and monitor blockchain transactions</p>
            </div>
            
            <MetricsCards />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
              <IssueTokensForm />
              <RecentTransactions />
            </div>
          </div>
        </div>
      </TokenHistoryProvider>
    </Web3Provider>
  );
};

export default BankDashboard;
