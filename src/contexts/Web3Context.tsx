import React, { createContext, useContext, useState, useEffect } from 'react';
import { AccountInterface } from 'starknet';
import { detectWallets, connectToWallet, WalletInfo } from '@/utils/walletUtils';
import { TokenService, createTokenService, TokenMintResult } from '@/services/tokenService';

interface Web3ContextType {
  account: AccountInterface | null;
  isConnected: boolean;
  isConnecting: boolean;
  balance: string;
  chainId: string;
  availableWallets: WalletInfo[];
  connectWallet: (walletId?: string) => Promise<void>;
  disconnectWallet: () => void;
  issueTokens: (recipient: string, amount: string) => Promise<TokenMintResult>;
  isIssuing: boolean;
  walletAddress: string;
  tokenService: TokenService | null;
  refreshBalance: () => Promise<void>;
  lastMintResult: TokenMintResult | null;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

// Mock ERC20 contract ABI (simplified for demo)
const ERC20_ABI = [
  {
    name: 'mint',
    type: 'function',
    inputs: [
      { name: 'to', type: 'felt' },
      { name: 'amount', type: 'Uint256' }
    ]
  }
];

const CONTRACT_ADDRESS = '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7'; // Mock address

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<AccountInterface | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [balance, setBalance] = useState('0');
  const [chainId, setChainId] = useState('');
  const [isIssuing, setIsIssuing] = useState(false);
  const [availableWallets, setAvailableWallets] = useState<WalletInfo[]>([]);
  const [walletAddress, setWalletAddress] = useState('');
  const [tokenService, setTokenService] = useState<TokenService | null>(null);
  const [lastMintResult, setLastMintResult] = useState<TokenMintResult | null>(null);

  useEffect(() => {
    const initializeWallets = async () => {
      try {
        const wallets = await detectWallets();
        setAvailableWallets(wallets);
        console.log('Available wallets detected:', wallets);
      } catch (error) {
        console.error('Error initializing wallets:', error);
      }
    };

    initializeWallets();
  }, []);

  useEffect(() => {
    // Check if wallet is already connected on mount
    const checkExistingConnection = async () => {
      try {
        console.log('Checking for existing wallet connection...');
      } catch (error) {
        console.error('Error checking existing connection:', error);
      }
    };

    checkExistingConnection();
  }, []);

  const refreshBalance = async () => {
    if (!tokenService || !walletAddress) return;
    
    try {
      const tokenBalance = await tokenService.getBalance(walletAddress);
      setBalance(tokenBalance.formatted);
      console.log('Token balance refreshed:', tokenBalance.formatted);
    } catch (error) {
      console.error('Error refreshing balance:', error);
      // Keep existing balance on error
    }
  };

  const connectWallet = async (walletId?: string) => {
    setIsConnecting(true);
    try {
      let walletInstance;
      
      if (walletId) {
        walletInstance = await connectToWallet(walletId);
      } else {
        const installedWallets = availableWallets.filter(w => w.installed);
        if (installedWallets.length > 0) {
          walletInstance = await connectToWallet(installedWallets[0].id);
        } else {
          throw new Error('No wallets available');
        }
      }

      if (walletInstance?.account) {
        setAccount(walletInstance.account);
        setWalletAddress(walletInstance.account.address);
        setIsConnected(true);
        
        // Create token service instance
        const service = createTokenService(walletInstance.account);
        setTokenService(service);
        
        // Get network info if available
        if (walletInstance.provider?.chainId) {
          setChainId(walletInstance.provider.chainId);
        }
        
        // Get actual token balance
        try {
          const tokenBalance = await service.getBalance(walletInstance.account.address);
          setBalance(tokenBalance.formatted);
          console.log('CAT Token balance:', tokenBalance.formatted);
        } catch (error) {
          console.error('Error fetching token balance:', error);
          setBalance('0'); // Fallback to zero if balance fetch fails
        }
        
        console.log('Wallet connected successfully:', {
          address: walletInstance.account.address,
          chainId: walletInstance.provider?.chainId
        });
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      
      // For demo purposes, create a mock connection if real connection fails
      if (process.env.NODE_ENV === 'development') {
        setIsConnected(true);
        setBalance('1,250.50');
        setWalletAddress('0x1234567890abcdef1234567890abcdef12345678');
        setChainId('0x534e5f474f45524c49'); // Goerli testnet
        console.log('Mock wallet connected for demo due to connection error');
      } else {
        throw error;
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    try {
      setAccount(null);
      setIsConnected(false);
      setBalance('0');
      setWalletAddress('');
      setChainId('');
      setTokenService(null);
      setLastMintResult(null);
      console.log('Wallet disconnected');
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  const issueTokens = async (recipient: string, amount: string): Promise<TokenMintResult> => {
    if (!isConnected || !tokenService) {
      throw new Error('Wallet not connected or token service unavailable');
    }

    setIsIssuing(true);
    try {
      console.log(`Issuing ${amount} CAT tokens to ${recipient}`);
      
      const result = await tokenService.mintTokens(recipient, amount);
      setLastMintResult(result);
      
      // Refresh balance after successful mint (with delay to allow blockchain confirmation)
      setTimeout(() => {
        refreshBalance();
      }, 5000);
      
      console.log('Tokens issued successfully:', result);
      return result;
      
    } catch (error) {
      console.error('Failed to issue tokens:', error);
      throw error;
    } finally {
      setIsIssuing(false);
    }
  };

  const value = {
    account,
    isConnected,
    isConnecting,
    balance,
    chainId,
    availableWallets,
    connectWallet,
    disconnectWallet,
    issueTokens,
    isIssuing,
    walletAddress,
    tokenService,
    refreshBalance,
    lastMintResult
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};
