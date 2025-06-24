
import React, { createContext, useContext, useEffect } from 'react';
import { Web3ContextType } from '@/types/web3';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { useTokenOperations } from '@/hooks/useTokenOperations';

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { walletState, availableWallets, connectWallet: connectWalletHook, disconnectWallet } = useWalletConnection();
  const { tokenState, refreshBalance, issueTokens, initializeBalances } = useTokenOperations(
    walletState.tokenService,
    walletState.walletAddress
  );

  const connectWallet = async (walletId?: string) => {
    try {
      console.log('🔄 Web3Context: Starting wallet connection...');
      const service = await connectWalletHook(walletId);
      
      if (service && walletState.walletAddress) {
        console.log('🔄 Web3Context: Initializing balances after connection...');
        await initializeBalances(service, walletState.walletAddress);
      }
    } catch (error) {
      console.error('❌ Web3Context: Wallet connection failed:', error);
      // Re-throw so components can handle the error appropriately
      throw error;
    }
  };

  useEffect(() => {
    if (walletState.tokenService && walletState.walletAddress && walletState.isConnected) {
      console.log('🔄 Web3Context: Auto-initializing balances for connected wallet');
      initializeBalances(walletState.tokenService, walletState.walletAddress);
    }
  }, [walletState.tokenService, walletState.walletAddress, walletState.isConnected, initializeBalances]);

  const value: Web3ContextType = {
    account: walletState.account,
    isConnected: walletState.isConnected,
    isConnecting: walletState.isConnecting,
    balance: tokenState.balance,
    strkBalance: tokenState.strkBalance,
    chainId: walletState.chainId,
    availableWallets,
    connectWallet,
    disconnectWallet,
    issueTokens,
    isIssuing: tokenState.isIssuing,
    walletAddress: walletState.walletAddress,
    tokenService: walletState.tokenService,
    refreshBalance,
    lastMintResult: tokenState.lastMintResult
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};
