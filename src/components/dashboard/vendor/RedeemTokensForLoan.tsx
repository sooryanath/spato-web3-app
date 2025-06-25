
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Banknote, AlertCircle, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useWeb3 } from "@/contexts/Web3Context";
import { useToast } from "@/hooks/use-toast";

const RedeemTokensForLoan = () => {
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { balance, isConnected } = useWeb3();
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

    setIsProcessing(true);
    
    try {
      // Simulate loan redemption process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Loan Redeemed Successfully",
        description: `${amount} CAT tokens redeemed for loan payment`,
      });
      
      setAmount("");
    } catch (error) {
      toast({
        title: "Redemption Failed",
        description: "Unable to process loan redemption. Please try again.",
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
        
        <Button
          onClick={handleRedeem}
          disabled={!isConnected || !isValidAmount || isProcessing}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          {isProcessing ? "Processing..." : "Redeem for Loan Payment"}
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
