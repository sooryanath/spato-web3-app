
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWeb3 } from "@/contexts/Web3Context";
import { useToast } from "@/hooks/use-toast";
import { ContractDeployer, formatDeploymentConfig, validateDeploymentConfig } from "@/utils/contractDeployment";
import { Rocket, Loader2, CheckCircle, AlertCircle } from "lucide-react";

const ContractDeployment = () => {
  const [deploymentData, setDeploymentData] = useState({
    name: "Central Bank Digital Currency",
    symbol: "CAT",
    initialSupply: "1000000",
    recipient: ""
  });
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentResult, setDeploymentResult] = useState<any>(null);
  
  const { account, isConnected, walletAddress } = useWeb3();
  const { toast } = useToast();

  const handleDeploy = async () => {
    if (!account || !isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to deploy the contract.",
        variant: "destructive"
      });
      return;
    }

    const config = formatDeploymentConfig(
      deploymentData.name,
      deploymentData.symbol,
      deploymentData.initialSupply,
      deploymentData.recipient || walletAddress
    );

    if (!validateDeploymentConfig(config)) {
      toast({
        title: "Invalid Configuration",
        description: "Please check all deployment parameters.",
        variant: "destructive"
      });
      return;
    }

    setIsDeploying(true);
    try {
      const deployer = await ContractDeployer.create(account);
      const result = await deployer.deployCATE Token(config);
      
      setDeploymentResult(result);
      toast({
        title: "Contract Deployed Successfully",
        description: `CAT Token deployed at: ${result.contractAddress}`,
      });
      
    } catch (error) {
      console.error('Deployment failed:', error);
      toast({
        title: "Deployment Failed",
        description: error.message || "Failed to deploy contract",
        variant: "destructive"
      });
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <Card className="border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Rocket className="w-5 h-5 text-purple-600" />
          <span>Deploy CAT Token Contract</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {deploymentResult ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span className="font-medium">Contract Deployed Successfully!</span>
            </div>
            
            <div className="space-y-2 text-sm">
              <div>
                <Label>Contract Address:</Label>
                <p className="font-mono bg-gray-100 p-2 rounded border break-all">
                  {deploymentResult.contractAddress}
                </p>
              </div>
              <div>
                <Label>Transaction Hash:</Label>
                <p className="font-mono bg-gray-100 p-2 rounded border break-all">
                  {deploymentResult.transactionHash}
                </p>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 p-3 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>Next Steps:</strong> Update your contract configuration with the deployed address 
                and restart the application to begin issuing CAT tokens.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Token Name</Label>
                <Input
                  id="name"
                  value={deploymentData.name}
                  onChange={(e) => setDeploymentData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="symbol">Token Symbol</Label>
                <Input
                  id="symbol"
                  value={deploymentData.symbol}
                  onChange={(e) => setDeploymentData(prev => ({ ...prev, symbol: e.target.value }))}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="supply">Initial Supply</Label>
              <Input
                id="supply"
                type="number"
                value={deploymentData.initialSupply}
                onChange={(e) => setDeploymentData(prev => ({ ...prev, initialSupply: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="recipient">Initial Recipient (optional)</Label>
              <Input
                id="recipient"
                placeholder="Leave empty to use your wallet address"
                value={deploymentData.recipient}
                onChange={(e) => setDeploymentData(prev => ({ ...prev, recipient: e.target.value }))}
                className="font-mono text-sm"
              />
            </div>
            
            <Button 
              onClick={handleDeploy}
              disabled={!isConnected || isDeploying}
              className="w-full"
            >
              {isDeploying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deploying Contract...
                </>
              ) : (
                <>
                  <Rocket className="mr-2 h-4 w-4" />
                  Deploy CAT Token
                </>
              )}
            </Button>
            
            {!isConnected && (
              <div className="flex items-center space-x-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <p className="text-sm text-amber-700">
                  Connect your wallet to deploy the contract
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContractDeployment;
