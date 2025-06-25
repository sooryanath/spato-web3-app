
import { AlertCircle } from "lucide-react";

interface ConnectionWarningProps {
  isConnected: boolean;
}

const ConnectionWarning = ({ isConnected }: ConnectionWarningProps) => {
  if (isConnected) return null;

  return (
    <div className="flex items-center space-x-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
      <AlertCircle className="w-4 h-4 text-amber-600" />
      <p className="text-sm text-amber-700">
        Connect your StarkNet wallet to issue tokens
      </p>
    </div>
  );
};

export default ConnectionWarning;
