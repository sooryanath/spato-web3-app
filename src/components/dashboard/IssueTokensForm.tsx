import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToastAction } from "@/components/ui/toast";
import { useState } from "react";
import { useWeb3 } from "@/contexts/Web3Context";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Coins, AlertCircle, CheckCircle, Info, ExternalLink } from "lucide-react";
import { formatAddress } from "@/utils/walletUtils";

// Registered anchor company address that is authorized to receive minted tokens
const REGISTERED_ANCHOR_ADDRESS = "0x064cea2cbf17fc72da230689dd4beccf81d3e9e1ff308ea9d72179a0dd27ed78";

const IssueTokensForm = () => {
  const [amount, setAmount] = useState("");
  const [company, setCompany] = useState("");
  const { isConnected, walletAddress, issueTokens, isIssuing } = useWeb3();
  const { toast } = useToast();

  const companies = [
    { id: "techcorp", name: "TechCorp Ltd" },
    { id: "manufacturing", name: "Manufacturing Inc" },
    { id: "retail", name: "Retail Solutions" },
    { id: "export", name: "Export House" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your StarkNet wallet to issue tokens.",
        variant: "destructive"
      });
      return;
    }

    if (!company || !amount) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid token amount.",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log(`🚀 Form: Starting token issuance for ${amount} CAT to registered anchor company`);
      
      // Show info toast about the process
      toast({
        title: "Starting Token Issuance",
        description: "Minting tokens to registered anchor company...",
        variant: "default"
      });
      
      // Always use the registered anchor company address for minting
      await issueTokens(REGISTERED_ANCHOR_ADDRESS, amount);
      
      const selectedCompany = companies.find(c => c.id === company);
      toast({
        title: "Tokens Issued Successfully",
        description: `${amount} CAT tokens have been issued for ${selectedCompany?.name || 'the selected company'}.`,
        variant: "default",
        action: (
          <ToastAction 
            altText="Go to Explorer"
            onClick={() => window.open('https://sepolia.voyager.online/contract/0x064cea2cbf17fc72da230689dd4beccf81d3e9e1ff308ea9d72179a0dd27ed78', '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            Explorer
          </ToastAction>
        )
      });
      
      // Reset form
      setAmount("");
      setCompany("");
    } catch (error: any) {
      console.error('❌ Form: Token issuance failed:', error);
      
      // Show specific error message based on error type
      let errorMessage = "Failed to issue tokens. Please try again.";
      
      if (error.message?.includes('User rejected') || error.message?.includes('user rejected')) {
        errorMessage = "Transaction was rejected by user.";
      } else if (error.message?.includes('not authorized') || error.message?.includes('Caller is not authorized')) {
        errorMessage = "Your wallet is not authorized to mint tokens. Please contact the administrator.";
      } else if (error.message?.includes('Invalid anchor company')) {
        errorMessage = "The anchor company is not registered. Please contact support.";
      } else if (error.message?.includes('network') || error.message?.includes('Failed to fetch')) {
        errorMessage = "Network error. Please check your connection and try again.";
      } else if (error.message?.includes('insufficient')) {
        errorMessage = "Insufficient balance to perform this transaction.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Token Issuance Failed",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  return (
    <Card className={isConnected ? "border-green-200" : "border-gray-200"}>
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
                {formatAddress(REGISTERED_ANCHOR_ADDRESS)}
              </p>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company">Company *</Label>
            <Select value={company} onValueChange={setCompany}>
              <SelectTrigger>
                <SelectValue placeholder="Select company" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((comp) => (
                  <SelectItem key={comp.id} value={comp.id}>
                    <div className="font-medium">{comp.name}</div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {company && (
              <div className="flex items-center space-x-2 p-2 bg-green-50 border border-green-200 rounded-md">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <p className="text-xs text-green-700">
                  Tokens will be minted for this company via the registered anchor
                </p>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Token Amount *</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount (e.g., 1000)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="1"
            />
            {amount && (
              <p className="text-xs text-gray-600">
                Issuing {amount} CAT tokens
              </p>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={!isConnected || isIssuing}
          >
            {isIssuing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Minting Tokens...
              </>
            ) : (
              <>
                <Coins className="mr-2 h-4 w-4" />
                Issue Tokens
              </>
            )}
          </Button>
          
          {!isConnected && (
            <div className="flex items-center space-x-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <p className="text-sm text-amber-700">
                Connect your StarkNet wallet to issue tokens
              </p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default IssueTokensForm;
