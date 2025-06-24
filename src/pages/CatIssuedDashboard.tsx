
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, ExternalLink, Coins } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Web3Provider } from "@/contexts/Web3Context";

const CatIssuedDashboard = () => {
  const navigate = useNavigate();

  const issuedTokens = [
    {
      id: "CAT-001",
      company: "TechCorp Ltd",
      amount: "50,00,000",
      txHash: "0x1234...abcd",
      blockNumber: "142,589",
      date: "2024-01-15",
      status: "Confirmed"
    },
    {
      id: "CAT-002",
      company: "Manufacturing Inc",
      amount: "25,00,000",
      txHash: "0x5678...efgh",
      blockNumber: "142,456",
      date: "2024-01-14",
      status: "Confirmed"
    },
    {
      id: "CAT-003",
      company: "Retail Solutions",
      amount: "75,00,000",
      txHash: "0x9012...ijkl",
      blockNumber: "142,234",
      date: "2024-01-13",
      status: "Pending"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed": return "text-green-600 bg-green-50";
      case "Pending": return "text-yellow-600 bg-yellow-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <Web3Provider>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Issued</CardTitle>
                <Coins className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹2.4 Cr</div>
                <p className="text-xs text-muted-foreground">150,00,000 CAT Tokens</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Companies</CardTitle>
                <Coins className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23</div>
                <p className="text-xs text-muted-foreground">Companies with CAT tokens</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Blockchain Network</CardTitle>
                <ExternalLink className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">StarkNet</div>
                <p className="text-xs text-muted-foreground">Layer 2 Scaling Solution</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Token Issuance History</CardTitle>
              <p className="text-sm text-gray-600">
                All CAT tokens issued on the StarkNet blockchain
              </p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Token ID</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Transaction Hash</TableHead>
                    <TableHead>Block</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {issuedTokens.map((token) => (
                    <TableRow key={token.id}>
                      <TableCell className="font-medium">{token.id}</TableCell>
                      <TableCell>{token.company}</TableCell>
                      <TableCell>₹{token.amount}</TableCell>
                      <TableCell className="font-mono text-sm">{token.txHash}</TableCell>
                      <TableCell>{token.blockNumber}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(token.status)}`}>
                          {token.status}
                        </span>
                      </TableCell>
                      <TableCell>{token.date}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" className="flex items-center space-x-1">
                          <ExternalLink className="w-3 h-3" />
                          <span>View</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </Web3Provider>
  );
};

export default CatIssuedDashboard;
