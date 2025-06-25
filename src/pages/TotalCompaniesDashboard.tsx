
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Building2, Users, Search, Filter, Phone, Mail, MapPin, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const TotalCompaniesDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [companyTypeFilter, setCompanyTypeFilter] = useState("all");
  const [verificationFilter, setVerificationFilter] = useState("all");

  const companies = [
    {
      id: "COMP-001",
      name: "Global Exports Ltd",
      type: "Anchor",
      industry: "Manufacturing",
      verificationStatus: "Verified",
      totalFunding: "₹5.2 Cr",
      activeVendors: 12,
      email: "contact@globalexports.com",
      phone: "+91-9876543210",
      address: "Mumbai, Maharashtra",
      registrationDate: "2023-08-15",
      lastActivity: "2024-01-15",
      riskRating: "Low",
      vendors: [
        { name: "TechCorp Ltd", amount: "₹75,00,000", status: "Active" },
        { name: "Steel Components Co", amount: "₹1,25,00,000", status: "Active" },
        { name: "Logistics Partners", amount: "₹50,00,000", status: "Pending" }
      ]
    },
    {
      id: "COMP-002",
      name: "Manufacturing Hub Inc",
      type: "Anchor",
      industry: "Industrial",
      verificationStatus: "Verified",
      totalFunding: "₹3.8 Cr",
      activeVendors: 8,
      email: "info@manufacturinghub.com",
      phone: "+91-9876543211",
      address: "Chennai, Tamil Nadu",
      registrationDate: "2023-09-20",
      lastActivity: "2024-01-14",
      riskRating: "Low",
      vendors: [
        { name: "Raw Materials Co", amount: "₹80,00,000", status: "Active" },
        { name: "Equipment Suppliers", amount: "₹60,00,000", status: "Active" }
      ]
    },
    {
      id: "COMP-003",
      name: "Retail Chain Solutions",
      type: "Anchor",
      industry: "Retail",
      verificationStatus: "Pending",
      totalFunding: "₹2.1 Cr",
      activeVendors: 15,
      email: "admin@retailchain.com",
      phone: "+91-9876543212",
      address: "Delhi, NCR",
      registrationDate: "2023-10-05",
      lastActivity: "2024-01-13",
      riskRating: "Medium",
      vendors: [
        { name: "Fashion Distributor Ltd", amount: "₹50,00,000", status: "Under Review" },
        { name: "Electronics Wholesale", amount: "₹40,00,000", status: "Active" }
      ]
    },
    {
      id: "COMP-004",
      name: "TechCorp Ltd",
      type: "Vendor",
      industry: "Technology",
      verificationStatus: "Verified",
      totalFunding: "₹75,00,000",
      activeVendors: 0,
      email: "support@techcorp.com",
      phone: "+91-9876543213",
      address: "Bangalore, Karnataka",
      registrationDate: "2023-11-12",
      lastActivity: "2024-01-15",
      riskRating: "Low",
      anchorCompany: "Global Exports Ltd"
    },
    {
      id: "COMP-005",
      name: "Fashion Distributor Ltd",
      type: "Vendor",
      industry: "Fashion",
      verificationStatus: "Under Review",
      totalFunding: "₹50,00,000",
      activeVendors: 0,
      email: "orders@fashiondist.com",
      phone: "+91-9876543214",
      address: "Mumbai, Maharashtra",
      registrationDate: "2023-12-01",
      lastActivity: "2024-01-13",
      riskRating: "High",
      anchorCompany: "Retail Chain Solutions"
    }
  ];

  const getVerificationColor = (status: string) => {
    switch (status) {
      case "Verified": return "text-green-600 bg-green-50 border-green-200";
      case "Pending": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "Under Review": return "text-blue-600 bg-blue-50 border-blue-200";
      case "Rejected": return "text-red-600 bg-red-50 border-red-200";
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

  const getVerificationIcon = (status: string) => {
    switch (status) {
      case "Verified": return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "Rejected": return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <AlertCircle className="w-4 h-4 text-yellow-600" />;
    }
  };

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = companyTypeFilter === "all" || company.type.toLowerCase() === companyTypeFilter.toLowerCase();
    const matchesVerification = verificationFilter === "all" || company.verificationStatus.toLowerCase() === verificationFilter.toLowerCase();
    return matchesSearch && matchesType && matchesVerification;
  });

  const anchorCompanies = filteredCompanies.filter(c => c.type === "Anchor");
  const vendorCompanies = filteredCompanies.filter(c => c.type === "Vendor");
  const totalFunding = companies.reduce((sum, company) => {
    const amount = company.totalFunding.replace(/[₹,]/g, '').replace(' Cr', '');
    return sum + parseFloat(amount);
  }, 0);

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
          <h1 className="text-2xl font-bold">Companies & Vendors Dashboard</h1>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
              <Building2 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{companies.length}</div>
              <p className="text-xs text-muted-foreground">Registered on platform</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Anchor Companies</CardTitle>
              <Building2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{anchorCompanies.length}</div>
              <p className="text-xs text-muted-foreground">Funding providers</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vendor Companies</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vendorCompanies.length}</div>
              <p className="text-xs text-muted-foreground">Funding recipients</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Funding</CardTitle>
              <Building2 className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalFunding.toFixed(1)} Cr</div>
              <p className="text-xs text-muted-foreground">Across all companies</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter Controls */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by company name, industry, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Select value={companyTypeFilter} onValueChange={setCompanyTypeFilter}>
                  <SelectTrigger className="w-40">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="anchor">Anchor Companies</SelectItem>
                    <SelectItem value="vendor">Vendor Companies</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={verificationFilter} onValueChange={setVerificationFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="under review">Under Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Companies Table */}
        <Card>
          <CardHeader>
            <CardTitle>Registered Companies</CardTitle>
            <p className="text-sm text-gray-600">
              Complete overview of anchor companies and their associated vendors
            </p>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company Details</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Verification</TableHead>
                  <TableHead>Funding/Risk</TableHead>
                  <TableHead>Contact Info</TableHead>
                  <TableHead>Activity</TableHead>
                  <TableHead>Associated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCompanies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{company.name}</p>
                        <p className="text-xs text-gray-500">{company.id}</p>
                        <p className="text-xs text-gray-500 flex items-center mt-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          {company.address}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={company.type === "Anchor" ? "border-blue-200 text-blue-700" : "border-purple-200 text-purple-700"}>
                        {company.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{company.industry}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getVerificationIcon(company.verificationStatus)}
                        <Badge className={`text-xs ${getVerificationColor(company.verificationStatus)}`}>
                          {company.verificationStatus}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{company.totalFunding}</p>
                        <Badge className={`text-xs ${getRiskColor(company.riskRating)}`}>
                          {company.riskRating} Risk
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-xs flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          {company.email}
                        </p>
                        <p className="text-xs flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          {company.phone}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-xs">Registered: {company.registrationDate}</p>
                        <p className="text-xs text-gray-500">Last: {company.lastActivity}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {company.type === "Anchor" ? (
                        <div>
                          <p className="text-xs font-medium">{company.activeVendors} Vendors</p>
                          <div className="space-y-1 mt-1">
                            {company.vendors?.slice(0, 2).map((vendor, index) => (
                              <p key={index} className="text-xs text-gray-600">
                                {vendor.name}
                              </p>
                            ))}
                            {(company.vendors?.length || 0) > 2 && (
                              <p className="text-xs text-blue-600">+{(company.vendors?.length || 0) - 2} more</p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p className="text-xs text-gray-600">Anchor:</p>
                          <p className="text-xs font-medium">{company.anchorCompany}</p>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredCompanies.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No companies found matching your search criteria.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TotalCompaniesDashboard;
