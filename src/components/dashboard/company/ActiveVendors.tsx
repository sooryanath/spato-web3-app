
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Building, Calendar } from "lucide-react";
import { useCompanyDashboard } from '@/contexts/CompanyDashboardContext';

const ActiveVendors = () => {
  const { activeVendors } = useCompanyDashboard();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-purple-600" />
          <span>Active Vendors</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activeVendors.map((vendor) => (
            <div key={vendor.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-full">
                    <Building className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{vendor.name}</h3>
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>Contract Date: {vendor.contractDate}</span>
                    </div>
                  </div>
                </div>
                <Badge className={getStatusColor(vendor.status)}>
                  {vendor.status}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Contract Value</p>
                  <p className="font-semibold text-blue-600">{vendor.contractValue}</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">CAT Tokens Allocated</p>
                  <p className="font-semibold text-green-600">{vendor.catTokens}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="pt-4 border-t mt-4">
          <Button variant="outline" className="w-full">
            Manage All Vendors
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActiveVendors;
