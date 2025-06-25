
import { useState } from "react";
import VendorDashboardHeader from "@/components/dashboard/VendorDashboardHeader";
import VendorMetricsCards from "@/components/dashboard/vendor/VendorMetricsCards";
import VendorWalletCard from "@/components/dashboard/vendor/VendorWalletCard";
import VendorTransactionHistory from "@/components/dashboard/vendor/VendorTransactionHistory";
import VendorNotifications from "@/components/dashboard/vendor/VendorNotifications";
import RedeemTokensForLoan from "@/components/dashboard/vendor/RedeemTokensForLoan";
import TransferToSubVendors from "@/components/dashboard/vendor/TransferToSubVendors";
import { Web3Provider } from "@/contexts/Web3Context";

const VendorDashboard = () => {
  return (
    <Web3Provider>
      <div className="min-h-screen bg-gray-50">
        <VendorDashboardHeader 
          userType="Vendor" 
          userName="Acme Corp" 
        />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-8 space-y-8">
              <VendorMetricsCards />
              <VendorTransactionHistory />
            </div>
            
            {/* Right Column - Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <VendorWalletCard />
              <RedeemTokensForLoan />
              <TransferToSubVendors />
              <VendorNotifications />
            </div>
          </div>
        </main>
      </div>
    </Web3Provider>
  );
};

export default VendorDashboard;
