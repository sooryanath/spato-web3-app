
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SignUpFormProps {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  setFullName: (name: string) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setConfirmPassword: (password: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const SignUpForm = ({ 
  fullName, 
  email, 
  password, 
  confirmPassword, 
  setFullName, 
  setEmail, 
  setPassword, 
  setConfirmPassword, 
  onSubmit 
}: SignUpFormProps) => {
  return (
    <div className="px-6 pb-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Create Account</h2>
        <p className="text-gray-600">
          Join our platform to get started
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
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
    </div>
  );
};

export default SignUpForm;
