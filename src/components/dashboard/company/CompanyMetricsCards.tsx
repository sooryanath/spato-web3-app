
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins, TrendingUp, Users, AlertCircle } from "lucide-react";

const CompanyMetricsCards = () => {
  // Mock data - in real implementation, this would come from API/blockchain
  const metrics = {
    totalTokensReceived: "2,450,000",
    totalTokensTransferred: "1,180,000",
    currentBalance: "1,270,000",
    activeVendors: 24,
    pendingDisputes: 3,
    monthlyGrowth: "+15.2%"
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-800">
            Current Balance
          </CardTitle>
          <Coins className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-900">
            {metrics.currentBalance} CAT
          </div>
          <p className="text-xs text-blue-600 mt-1">
            Available for transfers
          </p>
        </CardContent>
      </Card>

      <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-800">
            Tokens Received
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-900">
            {metrics.totalTokensReceived} CAT
          </div>
          <p className="text-xs text-green-600 mt-1">
            {metrics.monthlyGrowth} vs last month
          </p>
        </CardContent>
      </Card>

      <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-purple-800">
            Active Vendors
          </CardTitle>
          <Users className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-900">
            {metrics.activeVendors}
          </div>
          <p className="text-xs text-purple-600 mt-1">
            Verified partners
          </p>
        </CardContent>
      </Card>

      <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-amber-800">
            Pending Disputes
          </CardTitle>
          <AlertCircle className="h-4 w-4 text-amber-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-900">
            {metrics.pendingDisputes}
          </div>
          <p className="text-xs text-amber-600 mt-1">
            Require attention
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyMetricsCards;
