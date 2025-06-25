
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWeb3 } from "@/contexts/Web3Context";
import { investigateContract, validateContractABI, CONTRACT_CONFIG } from "@/utils/walletUtils";
import { Loader2, Search, CheckCircle, XCircle, AlertTriangle, Copy } from "lucide-react";
import { createProviderWithFailover } from "@/utils/walletUtils";
import { useToast } from '@/hooks/use-toast';

interface ContractInfo {
  classHash: string;
  availableFunctions: string[];
  abiValid: boolean;
  fullABI: any[];
}

const ContractDebugger = () => {
  const [isInvestigating, setIsInvestigating] = useState(false);
  const [contractInfo, setContractInfo] = useState<ContractInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { isConnected } = useWeb3();
  const { toast } = useToast();

  const investigateContractABI = async () => {
    setIsInvestigating(true);
    setError(null);
    setContractInfo(null);

    try {
      console.log('🔍 Starting comprehensive contract investigation...');
      const provider = await createProviderWithFailover(CONTRACT_CONFIG.network);
      
      // Investigate the actual contract
      const contractClass = await investigateContract(CONTRACT_CONFIG.address, provider);
      
      // Validate our current ABI
      const isValidABI = await validateContractABI(CONTRACT_CONFIG.address, CONTRACT_CONFIG.abi, provider);
      
      // Extract function names and full ABI from the actual contract
      const availableFunctions: string[] = [];
      const fullABI: any[] = [];
      
      if (contractClass.abi) {
        contractClass.abi.forEach((item: any) => {
          if (item.type === 'function') {
            availableFunctions.push(item.name);
            fullABI.push(item);
            console.log(`📋 Found function: ${item.name} (${item.state_mutability})`);
          }
        });
      }
      
      // Fix the class_hash access issue
      const classHash = (contractClass as any).class_hash || 'Unknown';
      
      setContractInfo({
        classHash,
        availableFunctions,
        abiValid: isValidABI,
        fullABI
      });
      
      console.log('✅ Contract investigation completed:', {
        totalFunctions: availableFunctions.length,
        functions: availableFunctions,
        abiValid: isValidABI
      });
      
    } catch (err: any) {
      console.error('❌ Contract investigation failed:', err);
      setError(err.message || 'Failed to investigate contract');
    } finally {
      setIsInvestigating(false);
    }
  };

  const copyABI = () => {
    if (contractInfo?.fullABI) {
      const abiString = JSON.stringify(contractInfo.fullABI, null, 2);
      navigator.clipboard.writeText(abiString);
      toast({
        title: "ABI Copied",
        description: "Full contract ABI has been copied to clipboard",
      });
    }
  };

  const updateABI = () => {
    if (!contractInfo?.fullABI) return;
    
    console.log('🔄 Contract ABI that should be used:');
    console.log(JSON.stringify(contractInfo.fullABI, null, 2));
    
    toast({
      title: "ABI Investigation Complete",
      description: `Found ${contractInfo.availableFunctions.length} functions. Check console for full ABI.`,
    });
  };

  return (
    <Card className="border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-blue-600" />
            <span>Contract ABI Investigator</span>
          </div>
          <Badge variant="outline">
            Debug Mode
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm space-y-2">
          <p><strong>Contract Address:</strong></p>
          <p className="font-mono text-xs bg-gray-100 p-2 rounded break-all">
            {CONTRACT_CONFIG.address}
          </p>
          <p><strong>Network:</strong> {CONTRACT_CONFIG.network}</p>
          <p><strong>Current ABI Functions:</strong> {CONTRACT_CONFIG.abi.length}</p>
        </div>
        
        <Button 
          onClick={investigateContractABI}
          disabled={isInvestigating}
          className="w-full"
        >
          {isInvestigating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Investigating Contract...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Fetch Complete Contract ABI
            </>
          )}
        </Button>
        
        {error && (
          <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded">
            <XCircle className="w-4 h-4 text-red-600" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
        
        {contractInfo && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {contractInfo.abiValid ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                )}
                <span className="text-sm font-medium">
                  ABI Status: {contractInfo.abiValid ? 'Valid' : 'Incomplete'}
                </span>
              </div>
              <Badge variant="secondary">
                {contractInfo.availableFunctions.length} functions found
              </Badge>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-2">Available Functions ({contractInfo.availableFunctions.length}):</p>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {contractInfo.availableFunctions.length > 0 ? (
                  contractInfo.availableFunctions.map((func, index) => (
                    <Badge key={index} variant="outline" className="text-xs mr-1 mb-1">
                      {func}
                    </Badge>
                  ))
                ) : (
                  <p className="text-xs text-gray-500">No functions found</p>
                )}
              </div>
            </div>

            {contractInfo.fullABI.length > 0 && (
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <Button onClick={copyABI} variant="outline" size="sm">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Full ABI
                  </Button>
                  <Button onClick={updateABI} size="sm">
                    Update ABI in Console
                  </Button>
                </div>
                <p className="text-xs text-gray-600">
                  Full ABI with {contractInfo.fullABI.length} functions ready for integration
                </p>
              </div>
            )}
            
            <div>
              <p className="text-sm font-medium">Class Hash:</p>
              <p className="text-xs font-mono bg-gray-100 p-2 rounded break-all">
                {contractInfo.classHash}
              </p>
            </div>
          </div>
        )}
        
        {!isConnected && (
          <div className="flex items-center space-x-2 p-3 bg-amber-50 border border-amber-200 rounded">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <p className="text-sm text-amber-700">
              Connect wallet for full debugging capabilities
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContractDebugger;
