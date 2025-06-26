
import { useEffect, useState } from 'react';
import { Web3Provider } from '@/contexts/Web3Context';
import { TokenHistoryProvider } from '@/contexts/TokenHistoryContext';
import { CompanyDashboardProvider } from '@/contexts/CompanyDashboardContext';
import { GlobalTransactionProvider } from '@/contexts/GlobalTransactionContext';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import CompanyMetricsCards from '@/components/dashboard/company/CompanyMetricsCards';
import TokenTransferForm from '@/components/dashboard/company/TokenTransferForm';
import VendorOverview from '@/components/dashboard/company/VendorOverview';
import RecentTokenTransfers from '@/components/dashboard/company/RecentTokenTransfers';
import DisputeResolution from '@/components/dashboard/company/DisputeResolution';
import WalletConnectionCard from '@/components/dashboard/company/WalletConnectionCard';
import RequestCATTokens from '@/components/dashboard/company/RequestCATTokens';
import ActiveVendors from '@/components/dashboard/company/ActiveVendors';
import CompanyHeaderDropdown from '@/components/dashboard/company/CompanyHeaderDropdown';

// Custom header component for company dashboard
const CompanyDashboardHeader = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Spato Finance</h1>
              <p className="text-sm text-gray-500">Company Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <CompanyHeaderDropdown />
          </div>
        </div>
      </div>
    </header>
  );
};

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
    <GlobalTransactionProvider>
      <Web3Provider>
        <TokenHistoryProvider>
          <CompanyDashboardProvider>
            <div className="min-h-screen bg-gray-50">
              <CompanyDashboardHeader />
              
              <div className="container mx-auto px-4 py-8 space-y-8">
                {/* Metrics Overview */}
                <CompanyMetricsCards />
                
                {/* Main Content Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  {/* Left Column */}
                  <div className="space-y-8">
                    <WalletConnectionCard />
                    <VendorOverview />
                    <ActiveVendors />
                  </div>
                  
                  {/* Middle Column */}
                  <div className="space-y-8">
                    <TokenTransferForm />
                    <RequestCATTokens />
                  </div>
                  
                  {/* Right Column */}
                  <div className="space-y-8">
                    <RecentTokenTransfers />
                    <DisputeResolution />
                  </div>
                </div>
              </div>
            </div>
          </CompanyDashboardProvider>
        </TokenHistoryProvider>
      </Web3Provider>
    </GlobalTransactionProvider>
  );
};

export default CompanyDashboard;
