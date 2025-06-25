
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Search, 
  Plus, 
  MoreVertical, 
  Mail, 
  Phone, 
  MapPin,
  TrendingUp,
  Clock
} from "lucide-react";

const VendorManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock vendor data
  const vendors = [
    {
      id: 1,
      name: "ABC Manufacturing Ltd",
      email: "contact@abcmfg.com",
      phone: "+1 (555) 123-4567",
      address: "123 Industrial Ave, Manufacturing City, MC 12345",
      category: "Manufacturing",
      status: "Active",
      tokensReceived: "450,000",
      totalTransactions: 28,
      lastTransaction: "2 hours ago",
      joinDate: "2023-06-15",
      rating: 4.8
    },
    {
      id: 2,
      name: "XYZ Logistics Co",
      email: "info@xyzlogistics.com",
      phone: "+1 (555) 234-5678",
      address: "456 Logistics Blvd, Shipping Harbor, SH 23456",
      category: "Logistics",
      status: "Active",
      tokensReceived: "320,000",
      totalTransactions: 22,
      lastTransaction: "1 day ago",
      joinDate: "2023-07-20",
      rating: 4.6
    },
    {
      id: 3,
      name: "Tech Solutions Inc",
      email: "hello@techsolutions.com",
      phone: "+1 (555) 345-6789",
      address: "789 Tech Park, Innovation District, ID 34567",
      category: "Technology",
      status: "Pending",
      tokensReceived: "280,000",
      totalTransactions: 15,
      lastTransaction: "3 days ago",
      joinDate: "2023-08-10",
      rating: 4.7
    },
    {
      id: 4,
      name: "Global Supplies Corp",
      email: "orders@globalsupplies.com",
      phone: "+1 (555) 456-7890",
      address: "321 Supply Chain St, Distribution Zone, DZ 45678",
      category: "Supplies",
      status: "Active",
      tokensReceived: "180,000",
      totalTransactions: 35,
      lastTransaction: "1 week ago",
      joinDate: "2023-05-05",
      rating: 4.5
    },
    {
      id: 5,
      name: "Premium Materials Ltd",
      email: "sales@premiummaterials.com",
      phone: "+1 (555) 567-8901",
      address: "654 Materials Row, Quality District, QD 56789",
      category: "Materials",
      status: "Inactive",
      tokensReceived: "125,000",
      totalTransactions: 12,
      lastTransaction: "2 weeks ago",
      joinDate: "2023-09-01",
      rating: 4.2
    }
  ];

  const filteredVendors = vendors.filter(vendor =>
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Vendor Management</h1>
          <p className="text-gray-600">Manage your vendor relationships and token distributions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Vendors</p>
                  <p className="text-2xl font-bold text-gray-900">{vendors.length}</p>
                </div>
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Vendors</p>
                  <p className="text-2xl font-bold text-green-600">
                    {vendors.filter(v => v.status === 'Active').length}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Distributed</p>
                  <p className="text-2xl font-bold text-purple-600">1.35M CAT</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                  <p className="text-2xl font-bold text-yellow-600">4.6</p>
                </div>
                <TrendingUp className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search vendors..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button className="ml-4">
            <Plus className="w-4 h-4 mr-2" />
            Add Vendor
          </Button>
        </div>

        {/* Vendors Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredVendors.map((vendor) => (
            <Card key={vendor.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Building2 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{vendor.name}</CardTitle>
                      <p className="text-sm text-gray-500">{vendor.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(vendor.status)}>
                      {vendor.status}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{vendor.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{vendor.phone}</span>
                  </div>
                  <div className="flex items-start space-x-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{vendor.address}</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tokens Received:</span>
                    <span className="font-medium">{vendor.tokensReceived} CAT</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Transactions:</span>
                    <span className="font-medium">{vendor.totalTransactions}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Rating:</span>
                    <span className="font-medium">⭐ {vendor.rating}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>Last activity: {vendor.lastTransaction}</span>
                  </div>
                </div>
                
                <div className="pt-4 flex space-x-2">
                  <Button size="sm" className="flex-1">
                    View Details
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    Send Tokens
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredVendors.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No vendors found matching your search</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorManagement;
