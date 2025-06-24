
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

interface DemoAccountsSectionProps {
  onDemoCredential: (email: string) => void;
}

const DemoAccountsSection = ({ onDemoCredential }: DemoAccountsSectionProps) => {
  return (
    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-blue-700">
          Demo Accounts Setup:
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-gray-600 hover:text-gray-800"
        >
          <Settings className="w-3 h-3 mr-1" />
          Setup Demo Users
        </Button>
      </div>

      <div className="space-y-2">
        <div className="text-xs font-medium text-blue-600 mb-2">
          Quick Fill Credentials:
        </div>
        
        <button
          type="button"
          onClick={() => onDemoCredential("bank@hdfc.com")}
          className="flex items-center w-full text-left p-2 rounded hover:bg-blue-100 transition-colors"
        >
          <span className="text-sm mr-2">🏦</span>
          <span className="text-sm text-blue-700">
            Bank: bank@hdfc.com / demo123
          </span>
        </button>

        <button
          type="button"
          onClick={() => onDemoCredential("finance@techcorp.com")}
          className="flex items-center w-full text-left p-2 rounded hover:bg-blue-100 transition-colors"
        >
          <span className="text-sm mr-2">🏢</span>
          <span className="text-sm text-blue-700">
            Company: finance@techcorp.com / demo123
          </span>
        </button>

        <button
          type="button"
          onClick={() => onDemoCredential("vendor@supplies.com")}
          className="flex items-center w-full text-left p-2 rounded hover:bg-blue-100 transition-colors"
        >
          <span className="text-sm mr-2">🤝</span>
          <span className="text-sm text-blue-700">
            Vendor: vendor@supplies.com / demo123
          </span>
        </button>
      </div>

      <p className="text-xs text-blue-600 mt-3">
        Click "Setup Demo Users" first, then click any credential above to auto-fill the form.
      </p>
    </div>
  );
};

export default DemoAccountsSection;
