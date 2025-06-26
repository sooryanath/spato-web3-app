
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTokenHistory } from "@/contexts/TokenHistoryContext";
import { useEffect } from "react";

const RecentTransactions = () => {
  const navigate = useNavigate();
  const { records, refreshHistory } = useTokenHistory();

  useEffect(() => {
    refreshHistory();
  }, [refreshHistory]);

  // Get the 3 most recent transactions from the token history
  const recentTransactions = records.slice(0, 3).map(record => ({
    id: record.id,
    type: "Token Issue",
    amount: `₹${record.amount}`,
    company: record.company,
    time: `${record.date} ${record.time}`,
    status: record.status
  }));

  // Fallback static data if no records available
  const fallbackTransactions = [
    {
      id: "TXN-001",
      type: "Token Issue",
      amount: "₹50,00,000",
      company: "TechCorp Ltd",
      time: "2 hours ago",
      status: "Confirmed"
    },
    {
      id: "TXN-002", 
      type: "Token Transfer",
      amount: "₹25,00,000",
      company: "Manufacturing Inc",
      time: "4 hours ago",
      status: "Confirmed"
    },
    {
      id: "TXN-003",
      type: "Token Redemption",
      amount: "₹75,00,000",
      company: "Retail Solutions", 
      time: "6 hours ago",
      status: "Confirmed"
    }
  ];

  const displayTransactions = recentTransactions.length > 0 ? recentTransactions : fallbackTransactions;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed": return "text-green-600 bg-green-50";
      case "Pending": return "text-yellow-600 bg-yellow-50";
      case "Failed": return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-sm">{transaction.type}</p>
                <p className="text-xs text-gray-600">{transaction.company}</p>
                <p className="text-xs text-gray-500">{transaction.time}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{transaction.amount}</p>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(transaction.status)}`}>
                  {transaction.status}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {/* View Explorer Button */}
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
