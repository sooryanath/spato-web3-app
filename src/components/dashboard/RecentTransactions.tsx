
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RecentTransactions = () => {
  const navigate = useNavigate();

  const transactions = [
    {
      id: "TXN-001",
      type: "Token Issue",
      amount: "₹50,00,000",
      company: "TechCorp Ltd",
      time: "2 hours ago"
    },
    {
      id: "TXN-002", 
      type: "Token Transfer",
      amount: "₹25,00,000",
      company: "Manufacturing Inc",
      time: "4 hours ago"
    },
    {
      id: "TXN-003",
      type: "Token Redemption",
      amount: "₹75,00,000",
      company: "Retail Solutions", 
      time: "6 hours ago"
    }
  ];

  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-sm">{transaction.type}</p>
                <p className="text-xs text-gray-600">{transaction.company}</p>
                <p className="text-xs text-gray-500">{transaction.time}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{transaction.amount}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Optimized View Explorer Button */}
        <div className="flex justify-end mt-4">
          <Button
            onClick={() => navigate('/bank-dashboard/cat-issued')}
            variant="ghost" 
            size="sm" 
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2"
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            <span className="text-xs">View Explorer</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
