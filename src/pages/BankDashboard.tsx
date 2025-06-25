
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import MetricsCards from "@/components/dashboard/MetricsCards";
import CATRequestsTable from "@/components/dashboard/CATRequestsTable";
import IssueTokensForm from "@/components/dashboard/IssueTokensForm";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import ActiveLoansTable from "@/components/dashboard/ActiveLoansTable";
import DisputedLoansTable from "@/components/dashboard/DisputedLoansTable";
import WalletConnection from "@/components/web3/WalletConnection";
import TransactionStatus from "@/components/web3/TransactionStatus";
import { Web3Provider } from "@/contexts/Web3Context";

const BankDashboard = () => {
  return (
    <Web3Provider>
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader userType="Bank" userName="HDFC Bank" />
        
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <MetricsCards />
          
          {/* Main content grid - optimized for full screen */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mt-6">
            {/* Primary content area */}
            <div className="xl:col-span-3 space-y-6">
              <CATRequestsTable />
              
              {/* Secondary tables in a responsive grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ActiveLoansTable />
                <DisputedLoansTable />
              </div>
            </div>
            
            {/* Sidebar with tools and forms */}
            <div className="xl:col-span-1 space-y-4">
              <WalletConnection />
              <TransactionStatus />
              <IssueTokensForm />
              <RecentTransactions />
            </div>
          </div>
        </div>
      </div>
    </Web3Provider>
  );
};

export default BankDashboard;
