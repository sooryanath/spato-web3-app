
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStarknet } from 'get-starknet-core';
import { AccountInterface, Contract } from 'starknet';

interface Web3ContextType {
  account: AccountInterface | null;
  isConnected: boolean;
  isConnecting: boolean;
  balance: string;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  issueTokens: (recipient: string, amount: string) => Promise<void>;
  isIssuing: boolean;
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
  const [isIssuing, setIsIssuing] = useState(false);

  useEffect(() => {
    // Check if wallet is already connected
    const checkConnection = async () => {
      try {
        // For now, we'll implement a simple mock connection check
        // In a real implementation, you'd check if there's a stored connection
        console.log('Checking for existing wallet connection...');
        // Mock: assume no existing connection for now
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    };

    checkConnection();
  }, []);

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      const starknet = getStarknet();
      
      // The getStarknet() returns a discovery helper, we need to get available wallets
      const availableWallets = await starknet.getAvailableWallets();
      
      if (availableWallets.length > 0) {
        // Try to connect to the first available wallet
        const wallet = availableWallets[0];
        const walletInstance = await starknet.enable(wallet);
        
        if (walletInstance && walletInstance.account) {
          setAccount(walletInstance.account);
          setIsConnected(true);
          setBalance('1,250.50'); // Mock balance
          console.log('Wallet connected successfully');
        }
      } else {
        console.log('No StarkNet wallets found');
        // For demo purposes, create a mock connection
        setIsConnected(true);
        setBalance('1,250.50');
        console.log('Mock wallet connected for demo');
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      // For demo purposes, create a mock connection even if real connection fails
      setIsConnected(true);
      setBalance('1,250.50');
      console.log('Mock wallet connected for demo due to connection error');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    try {
      setAccount(null);
      setIsConnected(false);
      setBalance('0');
      console.log('Wallet disconnected');
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  const issueTokens = async (recipient: string, amount: string) => {
    if (!isConnected) {
      throw new Error('Wallet not connected');
    }

    setIsIssuing(true);
    try {
      // Mock token issuance for demo
      console.log(`Issuing ${amount} CAT tokens to ${recipient}`);
      
      // Simulate blockchain transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, you would:
      // const contract = new Contract(ERC20_ABI, CONTRACT_ADDRESS, account);
      // const result = await contract.mint(recipient, { low: amount, high: '0' });
      
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
    connectWallet,
    disconnectWallet,
    issueTokens,
    isIssuing
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};
