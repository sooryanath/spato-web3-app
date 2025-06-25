
import { AlertTriangle } from "lucide-react";

interface ConnectionAlertProps {
  isConnected: boolean;
}

const ConnectionAlert = ({ isConnected }: ConnectionAlertProps) => {
  if (isConnected) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
      <AlertTriangle className="w-4 h-4 text-amber-600" />
      <p className="text-sm text-amber-700">
        Please connect your wallet to transfer tokens
      </p>
    </div>
  );
};

export default ConnectionAlert;
