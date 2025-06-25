
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
  const { tokenState, refreshBalance, issueTokens, transferTokens, initializeBalances } = useTokenOperations(
    walletState.tokenService,
    walletState.walletAddress
  );

  const connectWallet = async (walletId?: string) => {
    try {
      console.log('🔄 Web3Context: Starting wallet connection...');
      const service = await connectWalletHook(walletId);
      
      if (service && walletState.walletAddress) {
        console.log('🔄 Web3Context: Initializing balances after connection...');
        // Add a small delay to ensure wallet state is fully updated
        setTimeout(async () => {
          try {
            await initializeBalances(service, walletState.walletAddress);
            console.log('✅ Web3Context: Balance initialization completed');
          } catch (balanceError) {
            console.error('❌ Web3Context: Balance initialization failed:', balanceError);
            // Don't throw here, let the balance display fallback values
          }
        }, 1000);
      }
    } catch (error) {
      console.error('❌ Web3Context: Wallet connection failed:', error);
      // Re-throw so components can handle the error appropriately
      throw error;
    }
  };

  // Enhanced balance initialization with retry mechanism
  useEffect(() => {
    if (walletState.tokenService && walletState.walletAddress && walletState.isConnected) {
      console.log('🔄 Web3Context: Auto-initializing balances for connected wallet');
      
      const initializeWithRetry = async (retryCount = 0) => {
        try {
          await initializeBalances(walletState.tokenService, walletState.walletAddress);
          console.log('✅ Web3Context: Auto-initialization successful');
        } catch (error) {
          console.error(`❌ Web3Context: Auto-initialization failed (attempt ${retryCount + 1}):`, error);
          
          // Retry up to 2 times with increasing delays
          if (retryCount < 2) {
            const delay = (retryCount + 1) * 2000; // 2s, 4s delays
            console.log(`🔄 Web3Context: Retrying balance initialization in ${delay}ms...`);
            setTimeout(() => initializeWithRetry(retryCount + 1), delay);
          } else {
            console.error('❌ Web3Context: All retry attempts failed, using fallback balances');
          }
        }
      };

      // Start initialization with a small delay to ensure wallet is fully ready
      setTimeout(() => initializeWithRetry(), 500);
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
    transferTokens,
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
