
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Banknote, AlertCircle, CheckCircle, ExternalLink, ShieldAlert, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useWeb3 } from "@/contexts/Web3Context";
import { useToast } from "@/hooks/use-toast";
import { addressesEqual, normalizeAddress, formatAddressForDisplay } from "@/utils/addressUtils";

// Bank wallet address for token redemption
const BANK_WALLET_ADDRESS = "0x049D0D22Bba512f6A011cA4d461bAFE27349651d104bBEbDfd24233814Ca04E2";

// Expected vendor wallet address that can perform redemptions (normalized format)
const EXPECTED_VENDOR_ADDRESS = "0x2dec0e08e74972df0df86d11089d0bba1e22c87a6c0ede6ffc2c1a2243e3c16";

const RedeemTokensForLoan = () => {
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const { balance, isConnected, transferTokens, refreshBalance, walletAddress } = useWeb3();
  const { toast } = useToast();

  // Check if the connected wallet is the expected vendor wallet using normalized comparison
  const isCorrectVendorWallet = walletAddress ? addressesEqual(walletAddress, EXPECTED_VENDOR_ADDRESS) : false;

  const handleRedeem = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to redeem tokens",
        variant: "destructive"
      });
      return;
    }

    // Primary security check - validate vendor wallet using normalized comparison
    if (!isCorrectVendorWallet) {
      console.error(`🚫 Unauthorized redemption attempt from: ${walletAddress}`);
      console.error(`🔍 Address comparison details:`, {
        connected: walletAddress,
        expected: EXPECTED_VENDOR_ADDRESS,
        connectedNormalized: normalizeAddress(walletAddress || ''),
        expectedNormalized: normalizeAddress(EXPECTED_VENDOR_ADDRESS),
        areEqual: addressesEqual(walletAddress || '', EXPECTED_VENDOR_ADDRESS)
      });
      
      toast({
        title: "Unauthorized Wallet",
        description: "Only the authorized vendor wallet can perform token redemptions for loan payments",
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
      console.log(`🏦 Authorized redemption: ${amount} CAT tokens from vendor ${walletAddress} to bank wallet: ${BANK_WALLET_ADDRESS}`);
      
      // Double-check sender address before transfer (defense in depth)
      if (!addressesEqual(walletAddress || '', EXPECTED_VENDOR_ADDRESS)) {
        throw new Error('Security violation: Unauthorized wallet address for redemption');
      }
      
      const result = await transferTokens(BANK_WALLET_ADDRESS, amount);
      
      setTransactionHash(result.transactionHash);
      console.log(`✅ Loan redemption successful: ${result.transactionHash}`);
      
      toast({
        title: "Redemption Successful",
        description: `${amount} CAT tokens have been transferred to the bank for loan payment`,
      });
      
      // Refresh balance after successful transfer
      setTimeout(() => {
        refreshBalance();
      }, 3000);
      
      setAmount("");
    } catch (error: any) {
      console.error('❌ Token redemption failed:', error);
      
      let errorMessage = "Unable to process loan redemption. Please try again.";
      
      if (error.message?.includes('Security violation') || error.message?.includes('Unauthorized wallet')) {
        errorMessage = "Security violation detected. Only authorized vendor wallets can perform redemptions.";
        console.error('🚨 SECURITY ALERT: Unauthorized redemption attempt blocked');
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
  const canRedeem = isConnected && isCorrectVendorWallet && isValidAmount && !isProcessing;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Banknote className="w-5 h-5 text-green-600" />
          <span>Redeem Tokens for Loan</span>
          {isConnected && isCorrectVendorWallet && (
            <ShieldCheck className="w-4 h-4 text-green-600" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Security Status Alert */}
        {isConnected && (
          <div className={`p-3 rounded-lg border ${
            isCorrectVendorWallet 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center space-x-2">
              {isCorrectVendorWallet ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Authorized Vendor Wallet</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium text-red-800">Unauthorized Wallet</span>
                </>
              )}
            </div>
            <p className="text-xs mt-1 text-gray-700">
              {isCorrectVendorWallet 
                ? 'This wallet is authorized to perform loan redemptions.'
                : 'Only the authorized vendor wallet can perform redemptions. Please connect the correct wallet.'}
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
              disabled={!canRedeem}
              className={!isCorrectVendorWallet && isConnected ? 'border-red-300 bg-red-50' : ''}
            />
          </div>
          
          {amount && (
            <div className="flex items-center space-x-2 text-sm">
              {isValidAmount && isCorrectVendorWallet ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-green-600">Ready to redeem</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="text-red-600">
                    {!isCorrectVendorWallet ? "Unauthorized wallet" : 
                     requestedAmount > availableBalance ? "Insufficient balance" : "Invalid amount"}
                  </span>
                </>
              )}
            </div>
          )}
        </div>
        
        <div className="space-y-3">
          <div className="text-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-700">Security Information</span>
            </div>
            
            <div className="space-y-2">
              <div>
                <span className="text-xs text-gray-600">Authorized Vendor Wallet:</span>
                <div className="mt-1 p-2 bg-gray-50 rounded text-xs font-mono break-all">
                  {EXPECTED_VENDOR_ADDRESS}
                </div>
              </div>
              
              {isConnected && (
                <div>
                  <span className="text-xs text-gray-600">Connected Wallet:</span>
                  <div className="mt-1 p-2 bg-gray-50 rounded text-xs font-mono break-all flex items-center justify-between">
                    <span>{walletAddress}</span>
                    <Badge variant="outline" className={
                      isCorrectVendorWallet 
                        ? "text-green-700 border-green-300 bg-green-50" 
                        : "text-red-700 border-red-300 bg-red-50"
                    }>
                      {isCorrectVendorWallet ? "✓ Authorized" : "✗ Unauthorized"}
                    </Badge>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    Normalized: {normalizeAddress(walletAddress || '')}
                  </div>
                </div>
              )}
              
              <div>
                <span className="text-xs text-gray-600">Bank Wallet (Destination):</span>
                <div className="mt-1 p-2 bg-blue-50 rounded text-xs font-mono break-all">
                  {BANK_WALLET_ADDRESS}
                </div>
              </div>
            </div>
          </div>
          
          {transactionHash && (
            <div className="text-sm text-gray-600">
              <span className="font-medium">Transaction Hash:</span>
              <div className="mt-1 p-2 bg-green-50 rounded text-xs font-mono break-all flex items-center justify-between">
                <span>{transactionHash}</span>
                <ExternalLink className="w-3 h-3 text-green-600 ml-2 flex-shrink-0" />
              </div>
            </div>
          )}
        </div>
        
        <Button
          onClick={handleRedeem}
          disabled={!canRedeem}
          className={`w-full ${
            canRedeem 
              ? "bg-green-600 hover:bg-green-700" 
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {isProcessing ? (
            "Processing Secure Redemption..."
          ) : !isConnected ? (
            "Connect Wallet to Redeem"
          ) : !isCorrectVendorWallet ? (
            "Connect Authorized Wallet"
          ) : (
            "Redeem for Loan Payment"
          )}
        </Button>
        
        {/* Status Messages */}
        {!isConnected && (
          <div className="text-center p-3 bg-amber-50 rounded-lg">
            <p className="text-sm text-amber-600">
              Connect your wallet to redeem tokens for loan payment
            </p>
          </div>
        )}
        
        {isConnected && !isCorrectVendorWallet && (
          <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
            <p className="text-sm text-red-600 font-medium">
              Security Restriction: Only authorized vendor wallets can perform redemptions
            </p>
            <p className="text-xs text-red-500 mt-1">
              Please connect the correct vendor wallet to continue
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RedeemTokensForLoan;
