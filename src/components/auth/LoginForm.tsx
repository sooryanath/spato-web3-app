
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useLocation } from "react-router-dom";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleDemoCredential = (demoEmail: string) => {
    setFormData({
      email: demoEmail,
      password: "demo123"
    });
  };

  const getRedirectPath = (email: string, profile: any) => {
    // If user has a profile with a role, use that
    if (profile?.role) {
      switch (profile.role) {
        case 'bank':
          return '/bank-dashboard';
        case 'company':
          return '/company-dashboard';
        case 'vendor':
          return '/vendor-dashboard';
        default:
          return '/company-dashboard';
      }
    }

    // Fallback to email-based routing for demo accounts
    if (email.includes("bank@")) {
      return "/bank-dashboard";
    } else if (email.includes("finance@")) {
      return "/company-dashboard";
    } else if (email.includes("vendor@")) {
      return "/vendor-dashboard";
    }
    
    return "/company-dashboard"; // Default fallback
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signIn(formData.email, formData.password);

      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: "Logged in successfully!",
        });

        // Small delay to allow profile to load
        setTimeout(() => {
          const from = location.state?.from?.pathname;
          if (from) {
            navigate(from);
          } else {
            const redirectPath = getRedirectPath(formData.email, null);
            navigate(redirectPath);
          }
        }, 500);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-6 pb-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Welcome Back</h2>
        <p className="text-gray-600">Sign in to your account to continue</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-slate-800 hover:bg-slate-900 text-white py-3"
          disabled={isLoading}
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </Button>
      </form>

      {/* Demo Accounts Section */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="text-sm font-medium text-blue-700 mb-3">
          Demo Accounts - Click to Login:
        </div>
        
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => handleDemoCredential("bank@hdfc.com")}
            className="flex items-center w-full text-left p-3 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
          >
            <span className="text-lg mr-3">🏦</span>
            <div>
              <div className="text-sm font-medium text-blue-800">Bank Dashboard</div>
              <div className="text-xs text-blue-600">bank@hdfc.com</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleDemoCredential("finance@techcorp.com")}
            className="flex items-center w-full text-left p-3 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
          >
            <span className="text-lg mr-3">🏢</span>
            <div>
              <div className="text-sm font-medium text-blue-800">Company Dashboard</div>
              <div className="text-xs text-blue-600">finance@techcorp.com</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleDemoCredential("vendor@supplies.com")}
            className="flex items-center w-full text-left p-3 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
          >
            <span className="text-lg mr-3">🤝</span>
            <div>
              <div className="text-sm font-medium text-blue-800">Vendor Dashboard</div>
              <div className="text-xs text-blue-600">vendor@supplies.com</div>
            </div>
          </button>
        </div>

        <div className="mt-4 p-3 bg-blue-100 rounded-lg">
          <p className="text-xs text-blue-700 font-medium mb-1">
            🔑 All demo accounts use password: <code className="bg-white px-1 rounded">demo123</code>
          </p>
          <p className="text-xs text-blue-600">
            Click any account above to auto-fill credentials and test the respective dashboard.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
