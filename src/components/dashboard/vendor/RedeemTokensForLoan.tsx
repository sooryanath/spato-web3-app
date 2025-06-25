
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Banknote, AlertCircle, CheckCircle, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useWeb3 } from "@/contexts/Web3Context";
import { useToast } from "@/hooks/use-toast";

// Bank wallet address for token redemption
const BANK_WALLET_ADDRESS = "0x049D0D22Bba512f6A011cA4d461bAFE27349651d104bBEbDfd24233814Ca04E2";

const RedeemTokensForLoan = () => {
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const { balance, isConnected, transferTokens, refreshBalance } = useWeb3();
  const { toast } = useToast();

  const handleRedeem = async () => {
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
      console.log(`🏦 Redeeming ${amount} CAT tokens to bank wallet: ${BANK_WALLET_ADDRESS}`);
      
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
      
      if (error.message?.includes('insufficient balance')) {
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
              disabled={!isConnected || isProcessing}
            />
          </div>
          
          {amount && (
            <div className="flex items-center space-x-2 text-sm">
              {isValidAmount ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-green-600">Valid amount</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="text-red-600">
                    {requestedAmount > availableBalance ? "Insufficient balance" : "Invalid amount"}
                  </span>
                </>
              )}
            </div>
          )}
        </div>
        
        <div className="space-y-2">
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
          disabled={!isConnected || !isValidAmount || isProcessing}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          {isProcessing ? "Processing Redemption..." : "Redeem for Loan Payment"}
        </Button>
        
        {!isConnected && (
          <div className="text-center">
            <p className="text-sm text-amber-600">
              Connect your wallet to redeem tokens
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RedeemTokensForLoan;
