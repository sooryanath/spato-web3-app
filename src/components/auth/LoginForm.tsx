
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

        // Redirect to the page they were trying to access, or dashboard based on email
        const from = location.state?.from?.pathname;
        if (from) {
          navigate(from);
        } else {
          // Route based on email domain for demo purposes
          if (formData.email.includes("bank@")) {
            navigate("/bank-dashboard");
          } else if (formData.email.includes("finance@")) {
            navigate("/company-dashboard");
          } else if (formData.email.includes("vendor@")) {
            navigate("/vendor-dashboard");
          } else {
            navigate("/company-dashboard"); // Default
          }
        }
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
        <div className="text-xs font-medium text-blue-600 mb-3">
          Demo Accounts (Click to auto-fill):
        </div>
        
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => handleDemoCredential("bank@hdfc.com")}
            className="flex items-center w-full text-left p-2 rounded hover:bg-blue-100 transition-colors"
          >
            <span className="text-sm mr-2">🏦</span>
            <span className="text-sm text-blue-700">Bank: bank@hdfc.com</span>
          </button>

          <button
            type="button"
            onClick={() => handleDemoCredential("finance@techcorp.com")}
            className="flex items-center w-full text-left p-2 rounded hover:bg-blue-100 transition-colors"
          >
            <span className="text-sm mr-2">🏢</span>
            <span className="text-sm text-blue-700">Company: finance@techcorp.com</span>
          </button>

          <button
            type="button"
            onClick={() => handleDemoCredential("vendor@supplies.com")}
            className="flex items-center w-full text-left p-2 rounded hover:bg-blue-100 transition-colors"
          >
            <span className="text-sm mr-2">🤝</span>
            <span className="text-sm text-blue-700">Vendor: vendor@supplies.com</span>
          </button>
        </div>

        <p className="text-xs text-blue-600 mt-3">
          Password for all demo accounts: demo123
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
