
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink, Shield, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DisputedLoansExplorer = () => {
  const navigate = useNavigate();

  const disputedLoans = [
    {
      loanId: "L0987",
      vendor: "Hardware Suppliers",
      syndicateCompany: "TechCorp Industries",
      amount: "₹45,000",
      disputeAmount: "₹45,000",
      status: "Under Review",
      dateDisputed: "2024-05-10",
      dateIssued: "2024-04-10",
      disputeReason: "Service not delivered as per contract",
      priority: "High",
      txHash: "0x9876...5432"
    },
    {
      loanId: "L0876",
      vendor: "Software Solutions",
      syndicateCompany: "Global Manufacturing",
      amount: "₹1,20,000",
      disputeAmount: "₹60,000",
      status: "Evidence Required",
      dateDisputed: "2024-05-05",
      dateIssued: "2024-04-05",
      disputeReason: "Partial delivery dispute",
      priority: "Medium",
      txHash: "0x8765...4321"
    },
    {
      loanId: "L0765",
      vendor: "Logistics Partner",
      syndicateCompany: "Supply Chain Ltd",
      amount: "₹35,000",
      disputeAmount: "₹35,000",
      status: "Mediation",
      dateDisputed: "2024-04-28",
      dateIssued: "2024-03-28",
      disputeReason: "Damaged goods during transit",
      priority: "High",
      txHash: "0x7654...3210"
    },
    {
      loanId: "L0654",
      vendor: "Digital Marketing Inc",
      syndicateCompany: "Retail Solutions",
      amount: "₹80,000",
      disputeAmount: "₹30,000",
      status: "Under Review",
      dateDisputed: "2024-05-15",
      dateIssued: "2024-04-15",
      disputeReason: "Campaign performance below agreed metrics",
      priority: "Low",
      txHash: "0x6543...2109"
    },
    {
      loanId: "L0543",
      vendor: "Construction Materials",
      syndicateCompany: "Building Corp",
      amount: "₹2,50,000",
      disputeAmount: "₹1,25,000",
      status: "Awaiting Response",
      dateDisputed: "2024-05-20",
      dateIssued: "2024-04-20",
      disputeReason: "Quality issues with delivered materials",
      priority: "High",
      txHash: "0x5432...1098"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Under Review": return "text-orange-600 bg-orange-50";
      case "Evidence Required": return "text-red-600 bg-red-50";
      case "Mediation": return "text-blue-600 bg-blue-50";
      case "Awaiting Response": return "text-yellow-600 bg-yellow-50";
      case "Resolved": return "text-green-600 bg-green-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "text-red-600 bg-red-50";
      case "Medium": return "text-yellow-600 bg-yellow-50";
      case "Low": return "text-green-600 bg-green-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader userType="Bank" userName="HDFC Bank" />
      
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/bank-dashboard')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Disputed Loans Explorer</h1>
              <p className="text-gray-600">Resolution center for loan disputes</p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-orange-500" />
              <span>Active Disputes Overview</span>
            </CardTitle>
            <p className="text-sm text-gray-600">
              Total Disputes: {disputedLoans.length} | 
              Total Disputed Amount: ₹{disputedLoans.reduce((sum, loan) => sum + parseInt(loan.disputeAmount.replace(/[₹,]/g, '')), 0).toLocaleString()}
            </p>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Loan ID</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Disputed Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Date Disputed</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Transaction</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {disputedLoans.map((loan) => (
                  <TableRow key={loan.loanId}>
                    <TableCell className="font-medium">{loan.loanId}</TableCell>
                    <TableCell>{loan.vendor}</TableCell>
                    <TableCell>{loan.syndicateCompany}</TableCell>
                    <TableCell>{loan.amount}</TableCell>
                    <TableCell className="font-medium text-red-600">{loan.disputeAmount}</TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(loan.status)} border-0`}>
                        {loan.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getPriorityColor(loan.priority)} border-0`}>
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        {loan.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>{loan.dateDisputed}</TableCell>
                    <TableCell>
                      <div className="max-w-48 truncate" title={loan.disputeReason}>
                        {loan.disputeReason}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="ghost" className="p-1">
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button size="sm" variant="outline">Review</Button>
                        <Button size="sm" variant="outline" className="text-blue-600 hover:text-blue-700">
                          Mediate
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DisputedLoansExplorer;
