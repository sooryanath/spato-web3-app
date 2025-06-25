
import { CheckCircle, Coins, Info } from "lucide-react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { formatAddress } from "@/utils/walletUtils";

interface TokenIssueFormHeaderProps {
  isConnected: boolean;
  walletAddress: string;
  registeredAnchorAddress: string;
}

const TokenIssueFormHeader = ({ 
  isConnected, 
  walletAddress, 
  registeredAnchorAddress 
}: TokenIssueFormHeaderProps) => {
  return (
    <CardHeader>
      <CardTitle className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Coins className="w-5 h-5 text-blue-600" />
          <span>Issue CAT Tokens</span>
        </div>
        {isConnected && (
          <div className="flex items-center space-x-1 text-xs text-green-600">
            <CheckCircle className="w-3 h-3" />
            <span>Ready</span>
          </div>
        )}
      </CardTitle>
      {isConnected && walletAddress && (
        <div className="space-y-2">
          <p className="text-xs text-gray-600">
            Issuing from: {formatAddress(walletAddress)}
          </p>
          <div className="flex items-center space-x-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
            <Info className="w-4 h-4 text-blue-600" />
            <p className="text-xs text-blue-700">
              Tokens will be minted to the registered anchor company
            </p>
          </div>
          <div className="p-2 bg-gray-50 border border-gray-200 rounded-md">
            <p className="text-xs text-gray-600 font-medium">Anchor Company Address:</p>
            <p className="text-xs font-mono text-gray-800 break-all">
              {formatAddress(registeredAnchorAddress)}
            </p>
          </div>
        </div>
      )}
    </CardHeader>
  );
};

export default TokenIssueFormHeader;
