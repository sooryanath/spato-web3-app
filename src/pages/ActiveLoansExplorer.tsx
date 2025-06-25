
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ActiveLoansExplorer = () => {
  const navigate = useNavigate();

  const activeLoans = [
    {
      loanId: "L1001",
      vendorName: "Tech Solutions Ltd",
      company: "TechCorp Industries",
      amount: "₹75,000",
      interestRate: "12%",
      dueDate: "2024-06-15",
      total: "₹82,500",
      remaining: "₹82,500",
      status: "Active",
      issueDate: "2024-05-15",
      txHash: "0x1234...5678"
    },
    {
      loanId: "L1002",
      vendorName: "Manufacturing Experts",
      company: "Global Manufacturing",
      amount: "₹50,000",
      interestRate: "10%",
      dueDate: "2024-06-20",
      total: "₹55,000",
      remaining: "₹30,000",
      status: "Partially Paid",
      issueDate: "2024-05-10",
      txHash: "0x2345...6789"
    },
    {
      loanId: "L1003",
      vendorName: "Supply Chain Partners",
      company: "Logistics Ltd",
      amount: "₹1,25,000",
      interestRate: "11%",
      dueDate: "2024-07-05",
      total: "₹1,37,500",
      remaining: "₹1,37,500",
      status: "Active",
      issueDate: "2024-06-05",
      txHash: "0x3456...7890"
    },
    {
      loanId: "L1004",
      vendorName: "Digital Services Inc",
      company: "Tech Solutions",
      amount: "₹90,000",
      interestRate: "9%",
      dueDate: "2024-06-30",
      total: "₹98,100",
      remaining: "₹98,100",
      status: "Active",
      issueDate: "2024-05-30",
      txHash: "0x4567...8901"
    },
    {
      loanId: "L1005",
      vendorName: "Hardware Suppliers",
      company: "Manufacturing Corp",
      amount: "₹2,00,000",
      interestRate: "13%",
      dueDate: "2024-07-15",
      total: "₹2,26,000",
      remaining: "₹1,50,000",
      status: "Partially Paid",
      issueDate: "2024-06-15",
      txHash: "0x5678...9012"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "text-green-600 bg-green-50";
      case "Partially Paid": return "text-blue-600 bg-blue-50";
      case "Overdue": return "text-red-600 bg-red-50";
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
              <h1 className="text-2xl font-bold text-gray-900">Active Loans Explorer</h1>
              <p className="text-gray-600">Comprehensive view of all outstanding loans</p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-blue-500" />
              <span>Active Loans Overview</span>
            </CardTitle>
            <p className="text-sm text-gray-600">
              Total Active Loans: {activeLoans.length} | 
              Total Outstanding: ₹{activeLoans.reduce((sum, loan) => sum + parseInt(loan.remaining.replace(/[₹,]/g, '')), 0).toLocaleString()}
            </p>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Loan ID</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Principal</TableHead>
                  <TableHead>Interest</TableHead>
                  <TableHead>Total/Remaining</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Transaction</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeLoans.map((loan) => (
                  <TableRow key={loan.loanId}>
                    <TableCell className="font-medium">{loan.loanId}</TableCell>
                    <TableCell>{loan.vendorName}</TableCell>
                    <TableCell>{loan.company}</TableCell>
                    <TableCell>{loan.amount}</TableCell>
                    <TableCell>{loan.interestRate}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{loan.total}</div>
                        <div className="text-gray-500">{loan.remaining} remaining</div>
                      </div>
                    </TableCell>
                    <TableCell>{loan.dueDate}</TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(loan.status)} border-0`}>
                        {loan.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="ghost" className="p-1">
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button size="sm" variant="outline">View</Button>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                          Dispute
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

export default ActiveLoansExplorer;
