
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const RecentTransactions = () => {
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
    <Card>
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
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
