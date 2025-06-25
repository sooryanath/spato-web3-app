
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ExternalLink, Clock } from "lucide-react";

const RecentTokenTransfers = () => {
  // Mock transfer data
  const recentTransfers = [
    {
      id: 1,
      vendor: "ABC Manufacturing Ltd",
      amount: "25,000",
      purpose: "Raw Materials",
      date: "2024-01-15",
      time: "14:30",
      status: "Confirmed",
      txHash: "0x1234...abcd"
    },
    {
      id: 2,
      vendor: "XYZ Logistics Co",
      amount: "15,000",
      purpose: "Logistics & Shipping",
      date: "2024-01-15",
      time: "11:45",
      status: "Confirmed",
      txHash: "0x2345...bcde"
    },
    {
      id: 3,
      vendor: "Tech Solutions Inc",
      amount: "35,000",
      purpose: "Consulting Services",
      date: "2024-01-14",
      time: "16:20",
      status: "Pending",
      txHash: "0x3456...cdef"
    },
    {
      id: 4,
      vendor: "Global Supplies Corp",
      amount: "20,000",
      purpose: "Equipment Purchase",
      date: "2024-01-14",
      time: "09:15",
      status: "Confirmed",
      txHash: "0x4567...def0"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewTransaction = (txHash: string) => {
    // Open transaction in block explorer
    const explorerUrl = `https://testnet.starkscan.co/tx/${txHash}`;
    window.open(explorerUrl, '_blank');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ArrowUpRight className="w-5 h-5 text-green-600" />
          <span>Recent Token Transfers</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentTransfers.map((transfer) => (
          <div key={transfer.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="font-medium text-gray-900">{transfer.vendor}</p>
                <p className="text-sm text-gray-500">{transfer.purpose}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-600">
                  {transfer.amount} CAT
                </p>
                <Badge className={getStatusColor(transfer.status)}>
                  {transfer.status}
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                <span>{transfer.date} at {transfer.time}</span>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleViewTransaction(transfer.txHash)}
                className="text-xs"
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                View Tx
              </Button>
            </div>
          </div>
        ))}
        
        <div className="pt-4 border-t">
          <Button variant="outline" className="w-full">
            View All Transfers
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentTokenTransfers;
