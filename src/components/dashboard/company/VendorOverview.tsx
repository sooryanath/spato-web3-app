
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, ExternalLink, Building2, Clock } from "lucide-react";

const VendorOverview = () => {
  // Mock vendor data
  const topVendors = [
    {
      id: 1,
      name: "ABC Manufacturing Ltd",
      tokensReceived: "450,000",
      lastTransaction: "2 hours ago",
      status: "Active",
      category: "Manufacturing"
    },
    {
      id: 2,
      name: "XYZ Logistics Co",
      tokensReceived: "320,000",
      lastTransaction: "1 day ago",
      status: "Active",
      category: "Logistics"
    },
    {
      id: 3,
      name: "Tech Solutions Inc",
      tokensReceived: "280,000",
      lastTransaction: "3 days ago",
      status: "Pending",
      category: "Technology"
    },
    {
      id: 4,
      name: "Global Supplies Corp",
      tokensReceived: "180,000",
      lastTransaction: "1 week ago",
      status: "Active",
      category: "Supplies"
    }
  ];

  const handleViewAllVendors = () => {
    // Open vendor management page in a new window
    const vendorUrl = '/vendor-management';
    window.open(vendorUrl, '_blank', 'width=1200,height=800');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span>Vendor Overview</span>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleViewAllVendors}
            className="flex items-center space-x-1"
          >
            <span>View All</span>
            <ExternalLink className="w-3 h-3" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {topVendors.map((vendor) => (
          <div key={vendor.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <Building2 className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{vendor.name}</p>
                <p className="text-sm text-gray-500">{vendor.category}</p>
              </div>
            </div>
            
            <div className="text-right space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900">
                  {vendor.tokensReceived} CAT
                </span>
                <Badge className={getStatusColor(vendor.status)}>
                  {vendor.status}
                </Badge>
              </div>
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                <span>{vendor.lastTransaction}</span>
              </div>
            </div>
          </div>
        ))}
        
        <div className="pt-4 border-t">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total Active Vendors:</span>
            <span className="font-medium">24</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total Tokens Distributed:</span>
            <span className="font-medium">1,180,000 CAT</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VendorOverview;
