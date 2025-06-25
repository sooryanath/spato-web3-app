
import { useEffect, useState } from 'react';
import { Web3Provider } from '@/contexts/Web3Context';
import { TokenHistoryProvider } from '@/contexts/TokenHistoryContext';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import CompanyMetricsCards from '@/components/dashboard/company/CompanyMetricsCards';
import TokenTransferForm from '@/components/dashboard/company/TokenTransferForm';
import VendorOverview from '@/components/dashboard/company/VendorOverview';
import RecentTokenTransfers from '@/components/dashboard/company/RecentTokenTransfers';
import DisputeResolution from '@/components/dashboard/company/DisputeResolution';
import WalletConnectionCard from '@/components/dashboard/company/WalletConnectionCard';
import ContractDebugger from '@/components/debug/ContractDebugger';

const CompanyDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for dashboard initialization
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading TechCorp Industries Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <Web3Provider>
      <TokenHistoryProvider>
        <div className="min-h-screen bg-gray-50">
          <DashboardHeader 
            userType="Company" 
            userName="TechCorp Industries"
          />
          
          <div className="container mx-auto px-4 py-8 space-y-8">
            {/* Metrics Overview */}
            <CompanyMetricsCards />
            
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="space-y-8">
                <WalletConnectionCard />
                <VendorOverview />
                <ContractDebugger />
              </div>
              
              {/* Middle Column */}
              <div className="space-y-8">
                <TokenTransferForm />
              </div>
              
              {/* Right Column */}
              <div className="space-y-8">
                <RecentTokenTransfers />
                <DisputeResolution />
              </div>
            </div>
          </div>
        </div>
      </TokenHistoryProvider>
    </Web3Provider>
  );
};

export default CompanyDashboard;
