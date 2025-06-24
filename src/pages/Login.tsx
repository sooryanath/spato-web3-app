
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import LoginBackground from "@/components/login/LoginBackground";
import LoginHeader from "@/components/login/LoginHeader";
import LoginForm from "@/components/login/LoginForm";
import SignUpForm from "@/components/login/SignUpForm";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const navigate = useNavigate();

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sign in with:", { email, password });
    
    // Simple routing based on email domain
    if (email.includes("bank@")) {
      navigate("/bank-dashboard");
    } else if (email.includes("finance@")) {
      navigate("/company-dashboard");
    } else if (email.includes("vendor@")) {
      navigate("/vendor-dashboard");
    } else {
      navigate("/bank-dashboard"); // Default to bank dashboard
    }
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
      <LoginBackground />

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
          <LoginHeader />

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mx-6 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <LoginForm
                email={email}
                password={password}
                setEmail={setEmail}
                setPassword={setPassword}
                onSubmit={handleSignIn}
                onDemoCredential={handleDemoCredential}
              />
            </TabsContent>

            <TabsContent value="signup">
              <SignUpForm
                fullName={fullName}
                email={email}
                password={password}
                confirmPassword={confirmPassword}
                setFullName={setFullName}
                setEmail={setEmail}
                setPassword={setPassword}
                setConfirmPassword={setConfirmPassword}
                onSubmit={handleSignUp}
              />
            </TabsContent>
          </Tabs>

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
