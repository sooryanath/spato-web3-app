
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sign in with:", { email, password });
    // Handle sign in logic here
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sign up with:", { fullName, email, password, confirmPassword });
    // Handle sign up logic here
  };

  const handleDemoCredential = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("demo123");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Background overlay for extra depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20 pointer-events-none"></div>
      
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
          {/* Header with logo and title */}
          <div className="flex flex-col items-center pt-8 pb-6 px-6">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
              <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
                <div className="w-3 h-3 bg-purple-500 rounded-sm"></div>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-center mb-2">
              Spato Finance
            </h1>
            <p className="text-gray-600 text-center">
              Corporate Asset Tokenization Platform
            </p>
          </div>

          {/* Tab Navigation and Content */}
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mx-6 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login" className="px-6 pb-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Welcome Back</h2>
                <p className="text-gray-600">
                  Sign in to your account to continue
                </p>
              </div>

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

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-600">Remember me</span>
                  </label>
                  <button type="button" className="text-sm text-purple-600 hover:text-purple-800">
                    Forgot password?
                  </button>
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
            </TabsContent>

            {/* Sign Up Tab */}
            <TabsContent value="signup" className="px-6 pb-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Create Account</h2>
                <p className="text-gray-600">
                  Join our platform to get started
                </p>
              </div>

              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-medium">
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-sm font-medium">
                    Email
                  </Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-sm font-medium">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full"
                    required
                  />
                </div>

                <div className="flex items-center">
                  <input type="checkbox" className="mr-2" required />
                  <span className="text-sm text-gray-600">
                    I agree to the{" "}
                    <button type="button" className="text-purple-600 hover:text-purple-800">
                      Terms of Service
                    </button>{" "}
                    and{" "}
                    <button type="button" className="text-purple-600 hover:text-purple-800">
                      Privacy Policy
                    </button>
                  </span>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-slate-800 hover:bg-slate-900 text-white py-3"
                >
                  Create Account
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {/* Back to Home Link */}
          <div className="px-6 pb-6">
            <Link
              to="/"
              className="flex items-center justify-center w-full text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
