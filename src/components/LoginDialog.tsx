
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LoginDialog = ({ open, onOpenChange }: LoginDialogProps) => {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sign in with:", { email, password });
    // Handle sign in logic here
  };

  const handleDemoCredential = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("demo123");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 bg-white">
        {/* Header with logo and title */}
        <div className="flex flex-col items-center pt-8 pb-6 px-6">
          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
            <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
              <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold text-center mb-2">
            Spato Finance
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-center">
            Corporate Asset Tokenization Platform
          </DialogDescription>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 px-6">
          <button
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              activeTab === "login"
                ? "text-black border-b-2 border-black"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
          <button
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              activeTab === "signup"
                ? "text-black border-b-2 border-black"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("signup")}
          >
            Sign Up
          </button>
        </div>

        {/* Login Form */}
        <div className="px-6 py-6">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-xl font-semibold">Welcome Back</DialogTitle>
            <DialogDescription className="text-gray-600">
              Sign in to your account to continue
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-slate-800 hover:bg-slate-900 text-white py-3"
            >
              Sign In
            </Button>
          </form>

          {/* Demo Accounts Section */}
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
                onClick={() => handleDemoCredential("bank@hdfc.com")}
                className="flex items-center w-full text-left p-2 rounded hover:bg-blue-100 transition-colors"
              >
                <span className="text-sm mr-2">🏦</span>
                <span className="text-sm text-blue-700">
                  Bank: bank@hdfc.com / demo123
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoCredential("finance@techcorp.com")}
                className="flex items-center w-full text-left p-2 rounded hover:bg-blue-100 transition-colors"
              >
                <span className="text-sm mr-2">🏢</span>
                <span className="text-sm text-blue-700">
                  Company: finance@techcorp.com / demo123
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoCredential("vendor@supplies.com")}
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
        </div>

        {/* Back to Home Link */}
        <div className="px-6 pb-6">
          <button
            onClick={() => onOpenChange(false)}
            className="flex items-center justify-center w-full text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
