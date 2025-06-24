
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useWeb3 } from "@/contexts/Web3Context";
import { Wallet, Loader2, ExternalLink, Copy } from "lucide-react";
import { formatAddress, getNetworkName } from "@/utils/walletUtils";
import { useToast } from "@/hooks/use-toast";
import WalletSelector from "./WalletSelector";

const WalletConnection = () => {
  const { 
    account, 
    isConnected, 
    isConnecting, 
    balance, 
    chainId,
    walletAddress,
    availableWallets,
    connectWallet, 
    disconnectWallet 
  } = useWeb3();
  
  const [showWalletSelector, setShowWalletSelector] = useState(false);
  const { toast } = useToast();

  const handleConnectClick = () => {
    const installedWallets = availableWallets.filter(w => w.installed);
    
    if (installedWallets.length === 0) {
      setShowWalletSelector(true);
    } else if (installedWallets.length === 1) {
      connectWallet(installedWallets[0].id);
    } else {
      setShowWalletSelector(true);
    }
  };

  const handleWalletSelect = async (walletId: string) => {
    await connectWallet(walletId);
  };

  const copyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard"
      });
    }
  };

  const openExplorer = () => {
    if (walletAddress) {
      const explorerUrl = chainId === '0x534e5f4d41494e' 
        ? `https://starkscan.co/contract/${walletAddress}`
        : `https://testnet.starkscan.co/contract/${walletAddress}`;
      window.open(explorerUrl, '_blank');
    }
  };

  if (isConnected && (account || walletAddress)) {
    return (
      <>
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Wallet className="w-5 h-5 text-green-600" />
                <span className="text-green-800">Wallet Connected</span>
              </div>
              <Badge variant="outline" className="text-green-700 border-green-300">
                {chainId ? getNetworkName(chainId) : 'StarkNet'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Address:</p>
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-mono bg-white p-2 rounded border flex-1 truncate">
                    {formatAddress(walletAddress || account?.address || '')}
                  </p>
                  <Button size="sm" variant="ghost" onClick={copyAddress}>
                    <Copy className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={openExplorer}>
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Balance:</p>
                <p className="text-lg font-semibold text-green-700">{balance} ETH</p>
              </div>
              
              {chainId && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Network:</p>
                  <p className="text-sm text-gray-600">{getNetworkName(chainId)}</p>
                </div>
              )}
            </div>
            
            <Button 
              variant="outline" 
              onClick={disconnectWallet}
              className="w-full hover:bg-red-50 hover:border-red-200 hover:text-red-700"
            >
              Disconnect Wallet
            </Button>
          </CardContent>
        </Card>

        <WalletSelector
          isOpen={showWalletSelector}
          onClose={() => setShowWalletSelector(false)}
          onWalletSelect={handleWalletSelect}
          isConnecting={isConnecting}
          availableWallets={availableWallets}
        />
      </>
    );
  }

  return (
    <>
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wallet className="w-5 h-5 text-blue-600" />
            <span>Connect StarkNet Wallet</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Connect your StarkNet wallet to issue and manage CAT tokens on the blockchain.
              </p>
              
              {availableWallets.some(w => w.installed) ? (
                <div className="mb-4">
                  <p className="text-xs text-green-600 mb-2">
                    ✓ StarkNet wallet detected
                  </p>
                </div>
              ) : (
                <div className="mb-4">
                  <p className="text-xs text-amber-600 mb-2">
                    No StarkNet wallet detected
                  </p>
                </div>
              )}
            </div>
            
            <Button 
              onClick={handleConnectClick}
              disabled={isConnecting}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet className="mr-2 h-4 w-4" />
                  Connect Wallet
                </>
              )}
            </Button>
            
            <div className="text-center">
              <p className="text-xs text-gray-500">
                Supports Argent X, Braavos and other StarkNet wallets
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <WalletSelector
        isOpen={showWalletSelector}
        onClose={() => setShowWalletSelector(false)}
        onWalletSelect={handleWalletSelect}
        isConnecting={isConnecting}
        availableWallets={availableWallets}
      />
    </>
  );
};

export default WalletConnection;
