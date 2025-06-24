
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Settings } from "lucide-react";
import { CONTRACT_CONFIG, getDeploymentInstructions, validateContractAddress } from "@/utils/walletUtils";

const ConfigurationStatus = () => {
  const { contractInfo, steps } = getDeploymentInstructions();
  const isConfigured = validateContractAddress(CONTRACT_CONFIG.address) && !contractInfo.isTestAddress;

  return (
    <Card className="border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-blue-600" />
            <span>Configuration Status</span>
          </div>
          <Badge variant={isConfigured ? "default" : "destructive"}>
            {isConfigured ? "Ready" : "Setup Required"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            {isConfigured ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-500" />
            )}
            <span className="text-sm">
              Contract Address: {isConfigured ? "Configured" : "Using Test Address"}
            </span>
          </div>
          
          <div className="text-xs text-gray-600 bg-gray-100 p-2 rounded font-mono">
            Current: {CONTRACT_CONFIG.address}
          </div>
        </div>

        {!isConfigured && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-amber-700">Setup Instructions:</p>
            <ol className="text-xs space-y-1 text-gray-600">
              {steps.map((step, index) => (
                <li key={index} className="flex">
                  <span className="mr-2">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        <div className="text-xs text-gray-500">
          Network: {contractInfo.network} | 
          Token: {CONTRACT_CONFIG.symbol}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConfigurationStatus;
