
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, XCircle, ExternalLink, Copy } from "lucide-react";
import { useWeb3 } from "@/contexts/Web3Context";
import { useToast } from "@/hooks/use-toast";
import { formatAddress, getNetworkName } from "@/utils/walletUtils";

const TransactionStatus = () => {
  const { lastMintResult, chainId } = useWeb3();
  const { toast } = useToast();

  if (!lastMintResult) return null;

  const getStatusIcon = () => {
    switch (lastMintResult.status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600 animate-pulse" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = () => {
    switch (lastMintResult.status) {
      case 'confirmed':
        return 'bg-green-50 border-green-200';
      case 'pending':
        return 'bg-yellow-50 border-yellow-200';
      case 'failed':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const copyTxHash = () => {
    navigator.clipboard.writeText(lastMintResult.transactionHash);
    toast({
      title: "Transaction Hash Copied",
      description: "Transaction hash copied to clipboard"
    });
  };

  const openExplorer = () => {
    const explorerUrl = chainId === '0x534e5f4d41494e' 
      ? `https://starkscan.co/tx/${lastMintResult.transactionHash}`
      : `https://testnet.starkscan.co/tx/${lastMintResult.transactionHash}`;
    window.open(explorerUrl, '_blank');
  };

  return (
    <Card className={getStatusColor()}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <span className="text-sm">Latest Transaction</span>
          </div>
          <Badge variant="outline" className="text-xs">
            {lastMintResult.status.toUpperCase()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-xs font-medium text-gray-700 mb-1">Transaction Hash:</p>
          <div className="flex items-center space-x-2">
            <p className="text-xs font-mono bg-white p-2 rounded border flex-1 break-all">
              {formatAddress(lastMintResult.transactionHash)}
            </p>
            <Button size="sm" variant="ghost" onClick={copyTxHash}>
              <Copy className="w-3 h-3" />
            </Button>
            <Button size="sm" variant="ghost" onClick={openExplorer}>
              <ExternalLink className="w-3 h-3" />
            </Button>
          </div>
        </div>
        
        {lastMintResult.blockNumber && (
          <div>
            <p className="text-xs font-medium text-gray-700 mb-1">Block Number:</p>
            <p className="text-xs text-gray-600">{lastMintResult.blockNumber}</p>
          </div>
        )}
        
        {lastMintResult.status === 'pending' && (
          <div className="flex items-center space-x-2 p-2 bg-yellow-100 border border-yellow-200 rounded">
            <Clock className="w-3 h-3 text-yellow-600" />
            <p className="text-xs text-yellow-700">
              Transaction is being processed on {getNetworkName(chainId)}
            </p>
          </div>
        )}
        
        {lastMintResult.status === 'confirmed' && (
          <div className="flex items-center space-x-2 p-2 bg-green-100 border border-green-200 rounded">
            <CheckCircle className="w-3 h-3 text-green-600" />
            <p className="text-xs text-green-700">
              Transaction confirmed successfully!
            </p>
          </div>
        )}
        
        {lastMintResult.status === 'failed' && (
          <div className="flex items-center space-x-2 p-2 bg-red-100 border border-red-200 rounded">
            <XCircle className="w-3 h-3 text-red-600" />
            <p className="text-xs text-red-700">
              Transaction failed. Please try again.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionStatus;
