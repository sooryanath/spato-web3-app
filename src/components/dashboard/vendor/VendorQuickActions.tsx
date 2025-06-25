
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Settings, HelpCircle } from "lucide-react";

const VendorQuickActions = () => {
  const actions = [
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
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="w-full justify-start h-auto p-4"
              onClick={action.action}
            >
              <div className="flex items-center space-x-3">
                <action.icon className="w-5 h-5 text-gray-600" />
                <div className="text-left">
                  <div className="font-medium">{action.label}</div>
                  <div className="text-sm text-gray-500">{action.description}</div>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default VendorQuickActions;
