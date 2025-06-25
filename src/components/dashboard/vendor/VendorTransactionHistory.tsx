
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowDownLeft, ArrowUpRight, MoreHorizontal } from "lucide-react";

const VendorTransactionHistory = () => {
  const transactions = [
    {
      id: "TXN-001",
      type: "received",
      amount: "2,500.00",
      from: "TechCorp Ltd",
      date: "2024-01-15",
      status: "completed",
      description: "Monthly service payment"
    },
    {
      id: "TXN-002",
      type: "received",
      amount: "1,200.50",
      from: "StartupX Inc",
      date: "2024-01-14",
      status: "completed",
      description: "Consulting services"
    },
    {
      id: "TXN-003",
      type: "received",
      amount: "800.25",
      from: "Enterprise Co",
      date: "2024-01-13",
      status: "pending",
      description: "Development work"
    },
    {
      id: "TXN-004",
      type: "received",
      amount: "3,000.00",
      from: "BigTech Corp",
      date: "2024-01-12",
      status: "completed",
      description: "Project milestone"
    },
    {
      id: "TXN-005",
      type: "received",
      amount: "450.75",
      from: "Local Business",
      date: "2024-01-11",
      status: "completed",
      description: "Marketing services"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Transactions</CardTitle>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-green-100 rounded-full">
                  <ArrowDownLeft className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {transaction.from}
                  </div>
                  <div className="text-sm text-gray-500">
                    {transaction.description}
                  </div>
                  <div className="text-xs text-gray-400">
                    {transaction.date} • {transaction.id}
                  </div>
                </div>
              </div>
              <div className="text-right space-y-1">
                <div className="font-semibold text-green-600">
                  +{transaction.amount} CAT
                </div>
                {getStatusBadge(transaction.status)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default VendorTransactionHistory;
