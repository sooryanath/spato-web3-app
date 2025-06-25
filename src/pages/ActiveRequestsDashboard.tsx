
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText, Download, Check, X, Building2, Calendar, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const ActiveRequestsDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [requests, setRequests] = useState([
    {
      id: "REQ-001",
      anchorCompany: "Global Exports Ltd",
      requestingCompany: "TechCorp Ltd",
      amount: "₹75,00,000",
      purpose: "Working Capital for Q4",
      status: "Pending Review",
      submittedDate: "2024-01-15",
      documents: [
        { name: "Financial Statement.pdf", size: "2.4 MB" },
        { name: "Trade Agreement.pdf", size: "1.8 MB" },
        { name: "Tax Certificate.pdf", size: "0.9 MB" }
      ],
      collateral: "Inventory & Receivables",
      riskRating: "Medium"
    },
    {
      id: "REQ-002",
      anchorCompany: "Manufacturing Hub Inc",
      requestingCompany: "Steel Components Co",
      amount: "₹1,25,00,000",
      purpose: "Equipment Purchase",
      status: "Pending Review",
      submittedDate: "2024-01-14",
      documents: [
        { name: "Purchase Order.pdf", size: "1.2 MB" },
        { name: "Vendor Quote.pdf", size: "0.8 MB" },
        { name: "Bank Statement.pdf", size: "3.1 MB" }
      ],
      collateral: "Machinery & Equipment",
      riskRating: "Low"
    },
    {
      id: "REQ-003",
      anchorCompany: "Retail Chain Solutions",
      requestingCompany: "Fashion Distributor Ltd",
      amount: "₹50,00,000",
      purpose: "Seasonal Inventory",
      status: "Under Review",
      submittedDate: "2024-01-13",
      documents: [
        { name: "Inventory Report.pdf", size: "2.7 MB" },
        { name: "Sales Forecast.xlsx", size: "1.5 MB" }
      ],
      collateral: "Stock Inventory",
      riskRating: "High"
    }
  ]);

  const handleApprove = (requestId: string) => {
    setRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: "Approved" }
          : req
      )
    );
    
    toast({
      title: "Request Approved",
      description: `Request ${requestId} has been approved and will proceed to token issuance.`,
      variant: "default"
    });
  };

  const handleReject = (requestId: string) => {
    setRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: "Rejected" }
          : req
      )
    );
    
    toast({
      title: "Request Rejected",
      description: `Request ${requestId} has been rejected.`,
      variant: "destructive"
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved": return "text-green-600 bg-green-50 border-green-200";
      case "Rejected": return "text-red-600 bg-red-50 border-red-200";
      case "Under Review": return "text-blue-600 bg-blue-50 border-blue-200";
      case "Pending Review": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low": return "text-green-600 bg-green-50";
      case "Medium": return "text-yellow-600 bg-yellow-50";
      case "High": return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  return (
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
          <h1 className="text-2xl font-bold">Active CAT Requests</h1>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{requests.length}</div>
              <p className="text-xs text-muted-foreground">Active submissions</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Calendar className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {requests.filter(r => r.status === "Pending Review").length}
              </div>
              <p className="text-xs text-muted-foreground">Awaiting decision</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹2.5 Cr</div>
              <p className="text-xs text-muted-foreground">Requested funding</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Anchor Companies</CardTitle>
              <Building2 className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Active partners</p>
            </CardContent>
          </Card>
        </div>

        {/* Requests Table */}
        <Card>
          <CardHeader>
            <CardTitle>CAT Token Requests from Anchor Companies</CardTitle>
            <p className="text-sm text-gray-600">
              Review and process funding requests submitted through anchor company partners
            </p>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Anchor Company</TableHead>
                  <TableHead>Requesting Company</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Documents</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Building2 className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">{request.anchorCompany}</span>
                      </div>
                    </TableCell>
                    <TableCell>{request.requestingCompany}</TableCell>
                    <TableCell className="font-medium">{request.amount}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{request.purpose}</p>
                        <p className="text-xs text-gray-500">Collateral: {request.collateral}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {request.documents.map((doc, index) => (
                          <div key={index} className="flex items-center space-x-2 text-xs">
                            <FileText className="w-3 h-3 text-gray-400" />
                            <span className="truncate max-w-32">{doc.name}</span>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                              <Download className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-xs ${getRiskColor(request.riskRating)}`}>
                        {request.riskRating}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-xs ${getStatusColor(request.status)}`}>
                        {request.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{request.submittedDate}</TableCell>
                    <TableCell>
                      {request.status === "Pending Review" || request.status === "Under Review" ? (
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleApprove(request.id)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <Check className="w-3 h-3 mr-1" />
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleReject(request.id)}
                          >
                            <X className="w-3 h-3 mr-1" />
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          {request.status}
                        </Badge>
                      )}
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

export default ActiveRequestsDashboard;
