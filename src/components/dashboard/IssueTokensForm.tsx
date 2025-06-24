
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useWeb3 } from "@/contexts/Web3Context";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Coins, AlertCircle, CheckCircle } from "lucide-react";
import { formatAddress } from "@/utils/walletUtils";

const IssueTokensForm = () => {
  const [amount, setAmount] = useState("");
  const [company, setCompany] = useState("");
  const [recipient, setRecipient] = useState("");
  const [isValidAddress, setIsValidAddress] = useState(true);
  const { isConnected, walletAddress, issueTokens, isIssuing } = useWeb3();
  const { toast } = useToast();

  const companies = [
    { id: "techcorp", name: "TechCorp Ltd", address: "0x1234567890abcdef1234567890abcdef12345678" },
    { id: "manufacturing", name: "Manufacturing Inc", address: "0x2345678901bcdef12345678901cdef123456789" },
    { id: "retail", name: "Retail Solutions", address: "0x3456789012cdef123456789012def1234567890" },
    { id: "export", name: "Export House", address: "0x456789023def123456789023ef12345678901a" }
  ];

  const validateStarkNetAddress = (address: string): boolean => {
    if (!address) return false;
    // StarkNet addresses are typically 64 characters long and start with 0x
    const starknetRegex = /^0x[0-9a-fA-F]{1,64}$/;
    return starknetRegex.test(address);
  };

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

    if (!company || !amount || !recipient) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (!validateStarkNetAddress(recipient)) {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid StarkNet address.",
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
      await issueTokens(recipient, amount);
      
      const selectedCompany = companies.find(c => c.id === company);
      toast({
        title: "Tokens Issued Successfully",
        description: `${amount} CAT tokens have been issued to ${selectedCompany?.name || 'the recipient'}.`,
        variant: "default"
      });
      
      // Reset form
      setAmount("");
      setCompany("");
      setRecipient("");
    } catch (error) {
      toast({
        title: "Token Issuance Failed",
        description: "Failed to issue tokens. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCompanySelect = (companyId: string) => {
    setCompany(companyId);
    const selectedCompany = companies.find(c => c.id === companyId);
    if (selectedCompany) {
      setRecipient(selectedCompany.address);
      setIsValidAddress(true);
    }
  };

  const handleRecipientChange = (value: string) => {
    setRecipient(value);
    setIsValidAddress(validateStarkNetAddress(value));
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
          <p className="text-xs text-gray-600">
            Issuing from: {formatAddress(walletAddress)}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company">Company *</Label>
            <Select value={company} onValueChange={handleCompanySelect}>
              <SelectTrigger>
                <SelectValue placeholder="Select company" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((comp) => (
                  <SelectItem key={comp.id} value={comp.id}>
                    <div>
                      <div className="font-medium">{comp.name}</div>
                      <div className="text-xs text-gray-500">
                        {formatAddress(comp.address)}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient Address *</Label>
            <div className="relative">
              <Input
                id="recipient"
                placeholder="0x..."
                value={recipient}
                onChange={(e) => handleRecipientChange(e.target.value)}
                className={`font-mono text-sm pr-8 ${
                  recipient && !isValidAddress ? 'border-red-300 focus:border-red-500' : ''
                } ${
                  recipient && isValidAddress ? 'border-green-300 focus:border-green-500' : ''
                }`}
              />
              {recipient && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  {isValidAddress ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  )}
                </div>
              )}
            </div>
            {recipient && !isValidAddress && (
              <p className="text-xs text-red-600">
                Please enter a valid StarkNet address
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Token Amount *</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount (e.g., 1000000)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="1"
            />
            {amount && (
              <p className="text-xs text-gray-600">
                ≈ ₹{(parseFloat(amount) * 1.6).toLocaleString('en-IN')} CAT tokens
              </p>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={!isConnected || isIssuing || !isValidAddress}
          >
            {isIssuing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Issuing Tokens...
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
