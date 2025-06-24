
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import MetricsCards from "@/components/dashboard/MetricsCards";
import CATRequestsTable from "@/components/dashboard/CATRequestsTable";
import IssueTokensForm from "@/components/dashboard/IssueTokensForm";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import ActiveLoansTable from "@/components/dashboard/ActiveLoansTable";
import DisputedLoansTable from "@/components/dashboard/DisputedLoansTable";
import WalletConnection from "@/components/web3/WalletConnection";
import TransactionStatus from "@/components/web3/TransactionStatus";
import ContractDebugger from "@/components/debug/ContractDebugger";
import { Web3Provider } from "@/contexts/Web3Context";

const BankDashboard = () => {
  return (
    <Web3Provider>
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader userType="Bank" userName="HDFC Bank" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <MetricsCards />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-2">
              <CATRequestsTable />
            </div>
            <div className="space-y-6">
              <WalletConnection />
              <TransactionStatus />
              <ContractDebugger />
              <IssueTokensForm />
              <RecentTransactions />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <ActiveLoansTable />
            <DisputedLoansTable />
          </div>
        </div>
      </div>
    </Web3Provider>
  );
};

export default BankDashboard;
