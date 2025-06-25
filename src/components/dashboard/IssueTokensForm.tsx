
import { Card, CardContent } from "@/components/ui/card";
import { ToastAction } from "@/components/ui/toast";
import { useState } from "react";
import { useWeb3 } from "@/contexts/Web3Context";
import { useToast } from "@/hooks/use-toast";
import { ExternalLink } from "lucide-react";
import { useTokenHistory } from "@/contexts/TokenHistoryContext";
import TokenIssueFormHeader from "./token-issue/TokenIssueFormHeader";
import CompanySelector from "./token-issue/CompanySelector";
import TokenAmountInput from "./token-issue/TokenAmountInput";
import IssueTokenButton from "./token-issue/IssueTokenButton";
import ConnectionWarning from "./token-issue/ConnectionWarning";

// Registered anchor company address that is authorized to receive minted tokens
const REGISTERED_ANCHOR_ADDRESS = "0x064cea2cbf17fc72da230689dd4beccf81d3e9e1ff308ea9d72179a0dd27ed78";

const IssueTokensForm = () => {
  const [amount, setAmount] = useState("");
  const [company, setCompany] = useState("");
  const { isConnected, walletAddress, issueTokens, isIssuing } = useWeb3();
  const { toast } = useToast();
  const { addRecord } = useTokenHistory();

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
      const result = await issueTokens(REGISTERED_ANCHOR_ADDRESS, amount);
      
      // Add record to token history immediately
      const selectedCompany = companies.find(c => c.id === company);
      addRecord({
        company: selectedCompany?.name || 'Unknown Company',
        amount: numAmount.toLocaleString(),
        txHash: result.transactionHash,
        blockNumber: result.blockNumber || 'Pending',
        gasUsed: '21,000',
        gasPrice: '0.0001 ETH',
        tokenType: 'CAT',
        recipient: REGISTERED_ANCHOR_ADDRESS,
        purpose: 'Working Capital'
      });
      
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
      <TokenIssueFormHeader 
        isConnected={isConnected}
        walletAddress={walletAddress}
        registeredAnchorAddress={REGISTERED_ANCHOR_ADDRESS}
      />
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <CompanySelector 
            company={company}
            onCompanyChange={setCompany}
            companies={companies}
          />
          
          <TokenAmountInput 
            amount={amount}
            onAmountChange={setAmount}
          />
          
          <IssueTokenButton 
            isConnected={isConnected}
            isIssuing={isIssuing}
          />
          
          <ConnectionWarning isConnected={isConnected} />
        </form>
      </CardContent>
    </Card>
  );
};

export default IssueTokensForm;
