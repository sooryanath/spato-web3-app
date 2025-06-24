
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CatIssuedDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader userType="Bank" userName="HDFC Bank" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center space-x-4 mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/bank-dashboard')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Button>
          <h1 className="text-2xl font-bold">Total CAT Issued Dashboard</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>CAT Token Issuance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              This dashboard will show detailed information about all Corporate Asset Tokens (CAT) issued.
              Web3 integration will be implemented here to interact with the ERC20 token contract on Starkware blockchain.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CatIssuedDashboard;
