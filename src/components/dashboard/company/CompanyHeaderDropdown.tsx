
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User, Building, Settings, LogOut, ChevronDown, Save } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { Link } from "react-router-dom";

const CompanyHeaderDropdown = () => {
  const [open, setOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    companyName: 'TechCorp Industries',
    registrationNumber: 'CIN123456789',
    industry: 'Technology',
    address: '123 Business Park, Mumbai, India',
    phone: '+91 98765 43210',
    email: 'info@techcorp.com',
    website: 'www.techcorp.com',
    description: 'Leading technology solutions provider',
    establishedYear: '2010',
    employees: '500-1000',
    annualRevenue: '₹100-500 Crores'
  });
  const { toast } = useToast();

  const industries = [
    'Technology', 'Manufacturing', 'Healthcare', 'Finance', 'Retail', 
    'Automotive', 'Construction', 'Energy', 'Education', 'Other'
  ];

  const employeeRanges = [
    '1-10', '11-50', '51-200', '201-500', '500-1000', '1000+'
  ];

  const revenueRanges = [
    '₹1-10 Lakhs', '₹10-50 Lakhs', '₹50 Lakhs-1 Crore', 
    '₹1-10 Crores', '₹10-50 Crores', '₹50-100 Crores', 
    '₹100-500 Crores', '₹500+ Crores'
  ];

  const handleSave = () => {
    toast({
      title: "Profile Updated",
      description: "Company profile has been updated successfully",
    });
    setOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>TechCorp Industries</span>
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <div className="px-2 py-1.5">
            <p className="text-sm font-medium">TechCorp Industries</p>
            <p className="text-xs text-gray-500">Company Account</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setOpen(true)} className="cursor-pointer">
            <User className="w-4 h-4 mr-2" />
            <span>Company Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Building className="w-4 h-4 mr-2" />
            <span>Business Details</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Settings className="w-4 h-4 mr-2" />
            <span>Account Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <Link to="/login">
            <DropdownMenuItem className="cursor-pointer">
              <LogOut className="w-4 h-4 mr-2" />
              <span>Logout</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Company Profile & Onboarding</DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Information</TabsTrigger>
              <TabsTrigger value="business">Business Details</TabsTrigger>
              <TabsTrigger value="financial">Financial Information</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    value={profileData.companyName}
                    onChange={(e) => setProfileData({...profileData, companyName: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="registrationNumber">Registration Number *</Label>
                  <Input
                    id="registrationNumber"
                    value={profileData.registrationNumber}
                    onChange={(e) => setProfileData({...profileData, registrationNumber: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="industry">Industry *</Label>
                  <Select value={profileData.industry} onValueChange={(value) => setProfileData({...profileData, industry: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="establishedYear">Established Year</Label>
                  <Input
                    id="establishedYear"
                    value={profileData.establishedYear}
                    onChange={(e) => setProfileData({...profileData, establishedYear: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  value={profileData.address}
                  onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="business" className="space-y-4">
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={profileData.website}
                  onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="description">Company Description</Label>
                <Textarea
                  id="description"
                  value={profileData.description}
                  onChange={(e) => setProfileData({...profileData, description: e.target.value})}
                  rows={4}
                  placeholder="Describe your company's business, products, and services..."
                />
              </div>
              
              <div>
                <Label htmlFor="employees">Number of Employees</Label>
                <Select value={profileData.employees} onValueChange={(value) => setProfileData({...profileData, employees: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {employeeRanges.map((range) => (
                      <SelectItem key={range} value={range}>
                        {range}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
            
            <TabsContent value="financial" className="space-y-4">
              <div>
                <Label htmlFor="annualRevenue">Annual Revenue</Label>
                <Select value={profileData.annualRevenue} onValueChange={(value) => setProfileData({...profileData, annualRevenue: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {revenueRanges.map((range) => (
                      <SelectItem key={range} value={range}>
                        {range}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Financial Documentation</h4>
                <p className="text-sm text-blue-700 mb-3">
                  Upload financial documents to expedite CAT token requests
                </p>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Upload Audited Financial Statements
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Upload Bank Statements (Last 6 months)
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Upload GST Returns
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Profile
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CompanyHeaderDropdown;
