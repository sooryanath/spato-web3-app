
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet } from "lucide-react";
import WalletConnection from "@/components/web3/WalletConnection";

const VendorWalletCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Wallet className="w-5 h-5 text-blue-600" />
          <span>Wallet Connection</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <WalletConnection />
      </CardContent>
    </Card>
  );
};

export default VendorWalletCard;
