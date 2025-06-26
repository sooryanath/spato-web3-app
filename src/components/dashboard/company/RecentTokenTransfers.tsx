
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Clock } from "lucide-react";
import { useCompanyDashboard } from '@/contexts/CompanyDashboardContext';
import AllTransactionsModal from './AllTransactionsModal';

const RecentTokenTransfers = () => {
  const { tokenTransfers } = useCompanyDashboard();

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

  // Show recent 4 transfers
  const recentTransfers = tokenTransfers.slice(0, 4);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ArrowUpRight className="w-5 h-5 text-green-600" />
          <span>Recent Token Transfers</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentTransfers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <ArrowUpRight className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No token transfers yet</p>
            <p className="text-sm">Transfers will appear here after you send tokens to vendors</p>
          </div>
        ) : (
          recentTransfers.map((transfer) => (
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
              </div>
            </div>
          ))
        )}
        
        <div className="pt-4 border-t">
          <AllTransactionsModal />
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentTokenTransfers;
