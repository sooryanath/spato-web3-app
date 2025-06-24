
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AccountInterface, Contract } from 'starknet';
import { detectWallets, connectToWallet, WalletInfo } from '@/utils/walletUtils';

interface Web3ContextType {
  account: AccountInterface | null;
  isConnected: boolean;
  isConnecting: boolean;
  balance: string;
  chainId: string;
  availableWallets: WalletInfo[];
  connectWallet: (walletId?: string) => Promise<void>;
  disconnectWallet: () => void;
  issueTokens: (recipient: string, amount: string) => Promise<void>;
  isIssuing: boolean;
  walletAddress: string;
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
        // This would check for stored connection state
        // For now, we'll skip auto-connection
        console.log('Checking for existing wallet connection...');
      } catch (error) {
        console.error('Error checking existing connection:', error);
      }
    };

    checkExistingConnection();
  }, []);

  const connectWallet = async (walletId?: string) => {
    setIsConnecting(true);
    try {
      let walletInstance;
      
      if (walletId) {
        // Connect to specific wallet
        walletInstance = await connectToWallet(walletId);
      } else {
        // Try to connect to any available wallet (fallback)
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
        
        // Get network info if available
        if (walletInstance.provider?.chainId) {
          setChainId(walletInstance.provider.chainId);
        }
        
        // Mock balance - in real app, you'd fetch from blockchain
        setBalance('1,250.50');
        
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
      console.log('Wallet disconnected');
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  const issueTokens = async (recipient: string, amount: string) => {
    if (!isConnected || !account) {
      throw new Error('Wallet not connected');
    }

    setIsIssuing(true);
    try {
      console.log(`Issuing ${amount} CAT tokens to ${recipient}`);
      
      // Simulate blockchain transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, you would:
      // const contract = new Contract(ERC20_ABI, CONTRACT_ADDRESS, account);
      // const result = await contract.mint(recipient, { low: amount, high: '0' });
      // await account.waitForTransaction(result.transaction_hash);
      
      console.log('Tokens issued successfully');
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
    walletAddress
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};
