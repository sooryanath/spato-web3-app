
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut, User, FileText, Download, Settings, HelpCircle, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

interface VendorDashboardHeaderProps {
  userType: string;
  userName: string;
}

const VendorDashboardHeader = ({ userType, userName }: VendorDashboardHeaderProps) => {
  const quickActions = [
    {
      icon: FileText,
      label: "Generate Invoice",
      description: "Create payment invoice",
      action: () => console.log("Generate invoice")
    },
    {
      icon: Download,
      label: "Export Data",
      description: "Download transaction history",
      action: () => console.log("Export data")
    },
    {
      icon: Settings,
      label: "Account Settings",
      description: "Manage your profile",
      action: () => console.log("Account settings")
    },
    {
      icon: HelpCircle,
      label: "Support",
      description: "Get help and support",
      action: () => console.log("Support")
    }
  ];

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Spato Finance</h1>
              <p className="text-sm text-gray-500">{userType} Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>{userName}</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{userName}</p>
                  <p className="text-xs text-gray-500">{userType} Account</p>
                </div>
                <DropdownMenuSeparator />
                <div className="px-1 py-1">
                  <p className="text-xs font-medium text-gray-500 px-2 py-1.5">Quick Actions</p>
                  {quickActions.map((action, index) => (
                    <DropdownMenuItem 
                      key={index}
                      onClick={action.action}
                      className="flex items-start space-x-3 px-2 py-2 cursor-pointer"
                    >
                      <action.icon className="w-4 h-4 text-gray-600 mt-0.5" />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{action.label}</span>
                        <span className="text-xs text-gray-500">{action.description}</span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
                <DropdownMenuSeparator />
                <Link to="/login">
                  <DropdownMenuItem className="flex items-center space-x-2 cursor-pointer">
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default VendorDashboardHeader;
