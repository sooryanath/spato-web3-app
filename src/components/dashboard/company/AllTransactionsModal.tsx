
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpRight, ArrowDownLeft, FileText, ExternalLink, Eye } from "lucide-react";
import { useCompanyDashboard } from '@/contexts/CompanyDashboardContext';

const AllTransactionsModal = () => {
  const { tokenTransfers, tokensReceived, catRequests, getAllTransactions } = useCompanyDashboard();
  const [open, setOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Failed':
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'transfer':
        return <ArrowUpRight className="w-4 h-4 text-red-600" />;
      case 'received':
        return <ArrowDownLeft className="w-4 h-4 text-green-600" />;
      case 'cat_request':
        return <FileText className="w-4 h-4 text-blue-600" />;
      default:
        return null;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'transfer':
        return 'Token Transfer';
      case 'received':
        return 'Tokens Received';
      case 'cat_request':
        return 'CAT Request';
      default:
        return type;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          View All Transactions
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>All Transactions</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All ({getAllTransactions().length})</TabsTrigger>
            <TabsTrigger value="transfers">Transfers ({tokenTransfers.length})</TabsTrigger>
            <TabsTrigger value="received">Received ({tokensReceived.length})</TabsTrigger>
            <TabsTrigger value="requests">CAT Requests ({catRequests.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getAllTransactions().map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(transaction.type)}
                        <span className="font-medium">{getTypeLabel(transaction.type)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {'vendor' in transaction ? transaction.vendor : 
                           'from' in transaction ? transaction.from : 'CAT Token Request'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {'purpose' in transaction ? transaction.purpose : ''}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {transaction.amount} {transaction.type === 'cat_request' ? 'CAT' : 'CAT'}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p>{transaction.date}</p>
                        <p className="text-sm text-gray-500">{transaction.time}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(transaction.status)}>
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {transaction.type !== 'cat_request' && 'txHash' in transaction ? (
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          View Tx
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm">
                          <Eye className="w-3 h-3 mr-1" />
                          Details
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          
          <TabsContent value="transfers">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tokenTransfers.map((transfer) => (
                  <TableRow key={transfer.id}>
                    <TableCell className="font-medium">{transfer.vendor}</TableCell>
                    <TableCell>{transfer.purpose}</TableCell>
                    <TableCell className="font-medium">{transfer.amount} CAT</TableCell>
                    <TableCell>
                      <div>
                        <p>{transfer.date}</p>
                        <p className="text-sm text-gray-500">{transfer.time}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(transfer.status)}>
                        {transfer.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        View Tx
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          
          <TabsContent value="received">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>From</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tokensReceived.map((received) => (
                  <TableRow key={received.id}>
                    <TableCell className="font-medium">{received.from}</TableCell>
                    <TableCell>{received.purpose}</TableCell>
                    <TableCell className="font-medium">{received.amount} CAT</TableCell>
                    <TableCell>
                      <div>
                        <p>{received.date}</p>
                        <p className="text-sm text-gray-500">{received.time}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(received.status)}>
                        {received.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        View Tx
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          
          <TabsContent value="requests">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Documents</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {catRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.purpose}</TableCell>
                    <TableCell className="font-medium">{request.amount} CAT</TableCell>
                    <TableCell>{request.documents.length} files</TableCell>
                    <TableCell>
                      <div>
                        <p>{request.date}</p>
                        <p className="text-sm text-gray-500">{request.time}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-3 h-3 mr-1" />
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AllTransactionsModal;
