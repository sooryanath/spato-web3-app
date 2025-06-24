
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWeb3 } from "@/contexts/Web3Context";
import { Wallet, Loader2 } from "lucide-react";

const WalletConnection = () => {
  const { account, isConnected, isConnecting, balance, connectWallet, disconnectWallet } = useWeb3();

  if (isConnected && account) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wallet className="w-5 h-5 text-green-600" />
            <span>Wallet Connected</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Address:</p>
              <p className="text-sm font-mono bg-gray-100 p-2 rounded truncate">
                {account.address.slice(0, 6)}...{account.address.slice(-4)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Balance:</p>
              <p className="text-lg font-semibold">{balance} ETH</p>
            </div>
            <Button 
              variant="outline" 
              onClick={disconnectWallet}
              className="w-full"
            >
              Disconnect Wallet
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Wallet className="w-5 h-5" />
          <span>Connect Wallet</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Connect your StarkNet wallet to issue and manage CAT tokens.
          </p>
          <Button 
            onClick={connectWallet} 
            disabled={isConnecting}
            className="w-full"
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
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletConnection;
