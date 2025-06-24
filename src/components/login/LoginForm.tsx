
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DemoAccountsSection from "./DemoAccountsSection";

interface LoginFormProps {
  email: string;
  password: string;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onDemoCredential: (email: string) => void;
}

const LoginForm = ({ email, password, setEmail, setPassword, onSubmit, onDemoCredential }: LoginFormProps) => {
  return (
    <div className="px-6 pb-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Welcome Back</h2>
        <p className="text-gray-600">
          Sign in to your account to continue
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
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

      <DemoAccountsSection onDemoCredential={onDemoCredential} />
    </div>
  );
};

export default LoginForm;
