
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ExternalLink, Coins, Search, Filter, Download, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Web3Provider } from "@/contexts/Web3Context";
import { useState } from "react";

const CatIssuedDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  const issuedTokens = [
    {
      id: "CAT-001",
      company: "TechCorp Ltd",
      amount: "50,00,000",
      txHash: "0x1234...abcd",
      blockNumber: "142,589",
      date: "2024-01-15",
      time: "14:30:25",
      status: "Confirmed",
      gasUsed: "21,000",
      gasPrice: "0.0001 ETH",
      tokenType: "CAT",
      recipient: "0x789...def",
      purpose: "Working Capital"
    },
    {
      id: "CAT-002",
      company: "Manufacturing Inc",
      amount: "25,00,000",
      txHash: "0x5678...efgh",
      blockNumber: "142,456",
      date: "2024-01-14",
      time: "10:15:42",
      status: "Confirmed",
      gasUsed: "19,500",
      gasPrice: "0.0001 ETH",
      tokenType: "CAT",
      recipient: "0x123...ghi",
      purpose: "Equipment Purchase"
    },
    {
      id: "CAT-003",
      company: "Retail Solutions",
      amount: "75,00,000",
      txHash: "0x9012...ijkl",
      blockNumber: "142,234",
      date: "2024-01-13",
      time: "16:45:18",
      status: "Pending",
      gasUsed: "22,300",
      gasPrice: "0.0001 ETH",
      tokenType: "CAT",
      recipient: "0x456...jkl",
      purpose: "Inventory Finance"
    },
    {
      id: "CAT-004",
      company: "Export House Ltd",
      amount: "1,00,00,000",
      txHash: "0x3456...mnop",
      blockNumber: "142,123",
      date: "2024-01-12",
      time: "09:20:33",
      status: "Confirmed",
      gasUsed: "25,800",
      gasPrice: "0.0001 ETH",
      tokenType: "CAT",
      recipient: "0x789...mno",
      purpose: "Trade Finance"
    },
    {
      id: "CAT-005",
      company: "Global Logistics Co",
      amount: "40,00,000",
      txHash: "0x7890...qrst",
      blockNumber: "142,067",
      date: "2024-01-11",
      time: "13:55:07",
      status: "Confirmed",
      gasUsed: "20,100",
      gasPrice: "0.0001 ETH",
      tokenType: "CAT",
      recipient: "0x234...pqr",
      purpose: "Supply Chain Finance"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed": return "text-green-600 bg-green-50";
      case "Pending": return "text-yellow-600 bg-yellow-50";
      case "Failed": return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const filteredTokens = issuedTokens.filter(token => {
    const matchesSearch = token.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         token.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         token.txHash.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || token.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const sortedTokens = [...filteredTokens].sort((a, b) => {
    switch (sortBy) {
      case "date":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case "amount":
        return parseInt(b.amount.replace(/,/g, '')) - parseInt(a.amount.replace(/,/g, ''));
      case "company":
        return a.company.localeCompare(b.company);
      default:
        return 0;
    }
  });

  const totalIssued = issuedTokens.reduce((sum, token) => sum + parseInt(token.amount.replace(/,/g, '')), 0);
  const confirmedTokens = issuedTokens.filter(token => token.status === "Confirmed").length;

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
            <h1 className="text-2xl font-bold">CAT Token Explorer</h1>
          </div>

          {/* Enhanced Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Issued</CardTitle>
                <Coins className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{(totalIssued / 10000000).toFixed(1)} Cr</div>
                <p className="text-xs text-muted-foreground">{totalIssued.toLocaleString()} CAT Tokens</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Confirmed Transactions</CardTitle>
                <Calendar className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{confirmedTokens}</div>
                <p className="text-xs text-muted-foreground">Successful issuances</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Companies</CardTitle>
                <Coins className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{issuedTokens.length}</div>
                <p className="text-xs text-muted-foreground">Companies with CAT tokens</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Blockchain Network</CardTitle>
                <ExternalLink className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">StarkNet</div>
                <p className="text-xs text-muted-foreground">Layer 2 Scaling Solution</p>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Token Explorer */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Token Issuance History</CardTitle>
                  <p className="text-sm text-gray-600">
                    Detailed view of all CAT tokens issued on the StarkNet blockchain
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => window.open('https://sepolia.voyager.online/contract/0x0323569840755faaed149227f6110911d73255eb1f14df3614181e8d7fec315e#accountCalls', '_blank')}
                  className="flex items-center space-x-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>View on Voyager</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search and Filter Controls */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by company, token ID, or transaction hash..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="amount">Amount</SelectItem>
                      <SelectItem value="company">Company</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Enhanced Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Token ID</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Amount (₹)</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Transaction Hash</TableHead>
                    <TableHead>Block</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Gas Used</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedTokens.map((token) => (
                    <TableRow key={token.id}>
                      <TableCell className="font-medium">{token.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{token.company}</p>
                          <p className="text-xs text-gray-500 font-mono">{token.recipient}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">₹{token.amount}</TableCell>
                      <TableCell className="text-sm">{token.purpose}</TableCell>
                      <TableCell className="font-mono text-sm">
                        <div className="flex items-center space-x-2">
                          <span>{token.txHash}</span>
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>{token.blockNumber}</TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{token.date}</p>
                          <p className="text-xs text-gray-500">{token.time}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{token.gasUsed}</p>
                          <p className="text-xs text-gray-500">{token.gasPrice}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(token.status)}`}>
                          {token.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button size="sm" variant="outline" className="h-8">
                            <ExternalLink className="w-3 h-3 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Download className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {sortedTokens.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No tokens found matching your search criteria.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Web3Provider>
  );
};

export default CatIssuedDashboard;
