
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight, ArrowDownLeft, Clock, FileText } from "lucide-react";
import { useCompanyDashboard } from '@/contexts/CompanyDashboardContext';
import { useGlobalTransactions } from '@/contexts/GlobalTransactionContext';
import AllTransactionsModal from './AllTransactionsModal';

const RecentTokenTransfers = () => {
  const { tokenTransfers, tokensReceived } = useCompanyDashboard();
  const { getTransactionsByCompany } = useGlobalTransactions();

  // Get CAT requests from global transactions
  const companyTransactions = getTransactionsByCompany('TechCorp Industries');
  const catRequests = companyTransactions
    .filter(tx => tx.type === 'token_issue' && tx.purpose.includes('CAT Request'))
    .slice(0, 2);

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

  // Show recent 4 transfers and received
  const recentTransfers = tokenTransfers.slice(0, 4);
  const recentReceived = tokensReceived.slice(0, 4);

  const EmptyState = ({ type, icon: Icon }: { type: string; icon: any }) => (
    <div className="text-center py-8 text-gray-500">
      <Icon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
      <p>No {type} yet</p>
      <p className="text-sm">
        {type === 'token transfers' 
          ? 'Transfers will appear here after you send tokens to vendors'
          : type === 'tokens received'
          ? 'Received tokens will appear here after the bank issues tokens to your company'
          : 'CAT requests will appear here after you submit token requests'
        }
      </p>
    </div>
  );

  const TransactionList = ({ transactions, isReceived = false }: { transactions: any[]; isReceived?: boolean }) => (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="font-medium text-gray-900">
                {isReceived ? (transaction.from || transaction.vendor) : (transaction.vendor || transaction.to)}
              </p>
              <p className="text-sm text-gray-500">{transaction.purpose}</p>
            </div>
            <div className="text-right">
              <p className={`font-semibold ${isReceived ? 'text-blue-600' : 'text-green-600'}`}>
                {transaction.amount} {transaction.amount.includes('₹') ? '' : 'CAT'}
              </p>
              <Badge className={getStatusColor(transaction.status)}>
                {transaction.status}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>{transaction.date} at {transaction.time}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const CATRequestsList = ({ requests }: { requests: any[] }) => (
    <div className="space-y-4">
      {requests.map((request) => (
        <div key={request.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="font-medium text-gray-900">{request.to}</p>
              <p className="text-sm text-gray-500">{request.purpose}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-blue-600">{request.amount}</p>
              <Badge className={getStatusColor(request.status)}>
                {request.status}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>{request.date} at {request.time}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ArrowUpRight className="w-5 h-5 text-green-600" />
          <span>Recent Token Activity</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="received" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="received" className="flex items-center space-x-2">
              <ArrowDownLeft className="w-4 h-4" />
              <span>Received</span>
            </TabsTrigger>
            <TabsTrigger value="sent" className="flex items-center space-x-2">
              <ArrowUpRight className="w-4 h-4" />
              <span>Sent</span>
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Requests</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="received" className="mt-4">
            {recentReceived.length === 0 ? (
              <EmptyState type="tokens received" icon={ArrowDownLeft} />
            ) : (
              <TransactionList transactions={recentReceived} isReceived={true} />
            )}
          </TabsContent>
          
          <TabsContent value="sent" className="mt-4">
            {recentTransfers.length === 0 ? (
              <EmptyState type="token transfers" icon={ArrowUpRight} />
            ) : (
              <TransactionList transactions={recentTransfers} isReceived={false} />
            )}
          </TabsContent>

          <TabsContent value="requests" className="mt-4">
            {catRequests.length === 0 ? (
              <EmptyState type="CAT requests" icon={FileText} />
            ) : (
              <CATRequestsList requests={catRequests} />
            )}
          </TabsContent>
        </Tabs>
        
        <div className="pt-4 border-t mt-4">
          <AllTransactionsModal />
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentTokenTransfers;
