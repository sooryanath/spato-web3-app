
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut, User, Wallet, Loader2, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useWeb3 } from "@/contexts/Web3Context";
import { formatAddress } from "@/utils/walletUtils";

interface BankDashboardHeaderProps {
  userType: string;
  userName: string;
}

const BankDashboardHeader = ({ userType, userName }: BankDashboardHeaderProps) => {
  const { isConnected, isConnecting, connectWallet, disconnectWallet, walletAddress, balance } = useWeb3();

  const handleWalletClick = () => {
    if (isConnected) {
      disconnectWallet();
    } else {
      connectWallet();
    }
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Spato Finance</h1>
              <p className="text-sm text-gray-500">{userType} Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Compact Wallet Connection Button */}
            <Button
              variant={isConnected ? "outline" : "default"}
              size="sm"
              onClick={handleWalletClick}
              disabled={isConnecting}
              className={`flex items-center space-x-2 ${
                isConnected 
                  ? "border-green-200 bg-green-50 text-green-700 hover:bg-green-100" 
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {isConnecting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Connecting...</span>
                </>
              ) : isConnected ? (
                <>
                  <Wallet className="w-4 h-4" />
                  <span>{formatAddress(walletAddress)}</span>
                  <span className="text-xs bg-green-100 px-2 py-0.5 rounded">
                    {balance} CAT
                  </span>
                </>
              ) : (
                <>
                  <Wallet className="w-4 h-4" />
                  <span>Connect Wallet</span>
                </>
              )}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>{userName}</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{userName}</p>
                  <p className="text-xs text-gray-500">{userType} Account</p>
                </div>
                <DropdownMenuSeparator />
                <Link to="/login">
                  <DropdownMenuItem className="flex items-center space-x-2 cursor-pointer">
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default BankDashboardHeader;
