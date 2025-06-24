
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface Wallet {
  id: string;
  name: string;
  icon: string;
  installed: boolean;
}

interface WalletSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onWalletSelect: (walletId: string) => Promise<void>;
  isConnecting: boolean;
  availableWallets: Wallet[];
}

const WalletSelector = ({ 
  isOpen, 
  onClose, 
  onWalletSelect, 
  isConnecting, 
  availableWallets 
}: WalletSelectorProps) => {
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);

  const handleWalletSelect = async (walletId: string) => {
    setSelectedWallet(walletId);
    try {
      await onWalletSelect(walletId);
      onClose();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setSelectedWallet(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect StarkNet Wallet</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {availableWallets.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-sm text-gray-600 mb-4">
                No StarkNet wallets detected. Please install a StarkNet wallet to continue.
              </p>
              <Button
                variant="outline"
                onClick={() => window.open('https://www.argent.xyz/argent-x/', '_blank')}
              >
                Install Argent X
              </Button>
            </div>
          ) : (
            availableWallets.map((wallet) => (
              <Card 
                key={wallet.id} 
                className={`cursor-pointer hover:bg-gray-50 transition-colors ${
                  !wallet.installed ? 'opacity-50' : ''
                }`}
                onClick={() => wallet.installed && handleWalletSelect(wallet.id)}
              >
                <CardContent className="flex items-center space-x-4 p-4">
                  <img 
                    src={wallet.icon} 
                    alt={wallet.name} 
                    className="w-8 h-8 rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{wallet.name}</h3>
                    <p className="text-sm text-gray-600">
                      {wallet.installed ? 'Ready to connect' : 'Not installed'}
                    </p>
                  </div>
                  {isConnecting && selectedWallet === wallet.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : wallet.installed ? (
                    <Button size="sm">Connect</Button>
                  ) : (
                    <Button size="sm" variant="outline" disabled>
                      Install
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WalletSelector;
