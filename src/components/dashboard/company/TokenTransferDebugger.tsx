
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useWeb3 } from '@/contexts/Web3Context';
import { useToast } from '@/hooks/use-toast';

interface TokenTransferDebuggerProps {
  debugInfo: string[];
  onAddDebugInfo: (message: string) => void;
}

const TokenTransferDebugger = ({ debugInfo, onAddDebugInfo }: TokenTransferDebuggerProps) => {
  const { isConnected, walletAddress, tokenService } = useWeb3();
  const { toast } = useToast();

  const handleTestConnection = async () => {
    onAddDebugInfo('🧪 Testing wallet and contract connection...');
    
    if (!isConnected) {
      onAddDebugInfo('❌ No wallet connected');
      return;
    }

    if (!tokenService) {
      onAddDebugInfo('❌ Token service not available');
      return;
    }

    try {
      onAddDebugInfo('📊 Attempting to fetch balance...');
      await tokenService.getBalance(walletAddress);
      onAddDebugInfo('✅ Connection test successful');
      
      toast({
        title: "Connection Test",
        description: "Wallet and contract connection working properly",
      });
    } catch (error: any) {
      onAddDebugInfo(`❌ Connection test failed: ${error.message}`);
      toast({
        title: "Connection Test Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={handleTestConnection}
        disabled={!isConnected}
      >
        Test Connection
      </Button>

      {/* Debug Information */}
      {debugInfo.length > 0 && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
          <h4 className="text-sm font-medium mb-2">Debug Information:</h4>
          <div className="space-y-1">
            {debugInfo.map((info, index) => (
              <p key={index} className="text-xs font-mono text-gray-600">
                {info}
              </p>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default TokenTransferDebugger;
