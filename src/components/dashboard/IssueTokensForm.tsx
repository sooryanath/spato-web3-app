
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useWeb3 } from "@/contexts/Web3Context";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Coins } from "lucide-react";

const IssueTokensForm = () => {
  const [amount, setAmount] = useState("");
  const [company, setCompany] = useState("");
  const [recipient, setRecipient] = useState("");
  const { isConnected, issueTokens, isIssuing } = useWeb3();
  const { toast } = useToast();

  const companies = [
    { id: "techcorp", name: "TechCorp Ltd", address: "0x1234...5678" },
    { id: "manufacturing", name: "Manufacturing Inc", address: "0x2345...6789" },
    { id: "retail", name: "Retail Solutions", address: "0x3456...7890" },
    { id: "export", name: "Export House", address: "0x4567...8901" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to issue tokens.",
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

    try {
      await issueTokens(recipient, amount);
      toast({
        title: "Tokens Issued Successfully",
        description: `${amount} CAT tokens have been issued to ${company}.`
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
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Coins className="w-5 h-5 text-blue-600" />
          <span>Issue CAT Tokens</span>
        </CardTitle>
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
                    {comp.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient Address *</Label>
            <Input
              id="recipient"
              placeholder="0x..."
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="font-mono text-sm"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Token Amount *</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={!isConnected || isIssuing}
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
            <p className="text-sm text-amber-600 text-center">
              Connect your wallet to issue tokens
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default IssueTokensForm;
