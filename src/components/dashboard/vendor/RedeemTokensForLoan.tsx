
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Banknote, AlertCircle, CheckCircle, ExternalLink, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { useWeb3 } from "@/contexts/Web3Context";
import { useToast } from "@/hooks/use-toast";

// Bank wallet address for token redemption
const BANK_WALLET_ADDRESS = "0x049D0D22Bba512f6A011cA4d461bAFE27349651d104bBEbDfd24233814Ca04E2";

// Expected vendor wallet address that can perform redemptions
const EXPECTED_VENDOR_ADDRESS = "0x02dec0e08e74972df0df86d11089d0bba1e22c87a6c0ede6ffc2c1a2243e3c16";

const RedeemTokensForLoan = () => {
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const { balance, isConnected, transferTokens, refreshBalance, walletAddress } = useWeb3();
  const { toast } = useToast();

  // Check if the connected wallet is the expected vendor wallet
  const isCorrectVendorWallet = walletAddress?.toLowerCase() === EXPECTED_VENDOR_ADDRESS.toLowerCase();

  const handleRedeem = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to redeem tokens",
        variant: "destructive"
      });
      return;
    }

    if (!isCorrectVendorWallet) {
      toast({
        title: "Wrong Wallet Connected",
        description: "Please connect the authorized vendor wallet to perform redemptions",
        variant: "destructive"
      });
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to redeem",
        variant: "destructive"
      });
      return;
    }

    const requestedAmount = parseFloat(amount);
    const availableBalance = parseFloat(balance.replace(/,/g, '')) || 0;

    if (requestedAmount > availableBalance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough CAT tokens for this redemption",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setTransactionHash(null);
    
    try {
      console.log(`🏦 Redeeming ${amount} CAT tokens from vendor ${walletAddress} to bank wallet: ${BANK_WALLET_ADDRESS}`);
      
      // Verify sender address one more time before transfer
      if (walletAddress?.toLowerCase() !== EXPECTED_VENDOR_ADDRESS.toLowerCase()) {
        throw new Error('Unauthorized wallet address for redemption');
      }
      
      const result = await transferTokens(BANK_WALLET_ADDRESS, amount);
      
      setTransactionHash(result.transactionHash);
      
      toast({
        title: "Redemption Initiated",
        description: `${amount} CAT tokens are being transferred to the bank for loan payment`,
      });
      
      // Refresh balance after successful transfer
      setTimeout(() => {
        refreshBalance();
      }, 3000);
      
      setAmount("");
    } catch (error: any) {
      console.error('❌ Token redemption failed:', error);
      
      let errorMessage = "Unable to process loan redemption. Please try again.";
      
      if (error.message?.includes('Unauthorized wallet')) {
        errorMessage = "Unauthorized wallet address. Please connect the correct vendor wallet.";
      } else if (error.message?.includes('insufficient balance')) {
        errorMessage = "Insufficient balance to complete this redemption.";
      } else if (error.message?.includes('User rejected')) {
        errorMessage = "Transaction was rejected by user.";
      } else if (error.message?.includes('network')) {
        errorMessage = "Network error. Please check your connection and try again.";
      }
      
      toast({
        title: "Redemption Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const availableBalance = parseFloat(balance.replace(/,/g, '')) || 0;
  const requestedAmount = parseFloat(amount) || 0;
  const isValidAmount = requestedAmount > 0 && requestedAmount <= availableBalance;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Banknote className="w-5 h-5 text-green-600" />
          <span>Redeem Tokens for Loan</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Wallet Validation Alert */}
        {isConnected && !isCorrectVendorWallet && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-800">Wrong Wallet Connected</span>
            </div>
            <p className="text-xs text-amber-700 mt-1">
              Please connect the authorized vendor wallet to perform redemptions.
            </p>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Available Balance:</span>
            <Badge variant="outline" className="text-green-700">
              {balance} CAT
            </Badge>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="redeem-amount" className="text-sm font-medium text-gray-700">
              Amount to Redeem
            </label>
            <Input
              id="redeem-amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={!isConnected || isProcessing || !isCorrectVendorWallet}
            />
          </div>
          
          {amount && (
            <div className="flex items-center space-x-2 text-sm">
              {isValidAmount && isCorrectVendorWallet ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-green-600">Valid amount</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="text-red-600">
                    {!isCorrectVendorWallet ? "Wrong wallet connected" : 
                     requestedAmount > availableBalance ? "Insufficient balance" : "Invalid amount"}
                  </span>
                </>
              )}
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="text-sm text-gray-600">
            <span className="font-medium">Expected Vendor Wallet:</span>
            <div className="mt-1 p-2 bg-gray-50 rounded text-xs font-mono break-all">
              {EXPECTED_VENDOR_ADDRESS}
            </div>
            {isConnected && (
              <div className="mt-1 flex items-center space-x-2">
                <span className="text-xs">Status:</span>
                {isCorrectVendorWallet ? (
                  <Badge variant="outline" className="text-green-700 border-green-300">
                    ✓ Authorized
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-red-700 border-red-300">
                    ✗ Unauthorized
                  </Badge>
                )}
              </div>
            )}
          </div>

          <div className="text-sm text-gray-600">
            <span className="font-medium">Bank Wallet:</span>
            <div className="mt-1 p-2 bg-gray-50 rounded text-xs font-mono break-all">
              {BANK_WALLET_ADDRESS}
            </div>
          </div>
          
          {transactionHash && (
            <div className="text-sm text-gray-600">
              <span className="font-medium">Transaction:</span>
              <div className="mt-1 p-2 bg-blue-50 rounded text-xs font-mono break-all flex items-center justify-between">
                <span>{transactionHash}</span>
                <ExternalLink className="w-3 h-3 text-blue-600 ml-2 flex-shrink-0" />
              </div>
            </div>
          )}
        </div>
        
        <Button
          onClick={handleRedeem}
          disabled={!isConnected || !isValidAmount || isProcessing || !isCorrectVendorWallet}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          {isProcessing ? "Processing Redemption..." : "Redeem for Loan Payment"}
        </Button>
        
        {!isConnected ? (
          <div className="text-center">
            <p className="text-sm text-amber-600">
              Connect your wallet to redeem tokens
            </p>
          </div>
        ) : !isCorrectVendorWallet ? (
          <div className="text-center">
            <p className="text-sm text-red-600">
              Connect the authorized vendor wallet to perform redemptions
            </p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default RedeemTokensForLoan;
