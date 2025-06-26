
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

  // Debug balance state changes
  useEffect(() => {
    console.log('🔍 Web3Context: Token state updated:', {
      balance: tokenState.balance,
      strkBalance: tokenState.strkBalance,
      isIssuing: tokenState.isIssuing,
      hasLastMintResult: !!tokenState.lastMintResult
    });
  }, [tokenState]);

  const connectWallet = async (walletId?: string) => {
    try {
      console.log('🔄 Web3Context: Starting wallet connection...');
      const service = await connectWalletHook(walletId);
      
      if (service && walletState.walletAddress) {
        console.log('🔄 Web3Context: Initializing balances after connection...', {
          hasService: !!service,
          walletAddress: walletState.walletAddress
        });
        
        setTimeout(async () => {
          try {
            await initializeBalances(service, walletState.walletAddress);
            console.log('✅ Web3Context: Balance initialization completed');
          } catch (balanceError) {
            console.error('❌ Web3Context: Balance initialization failed:', balanceError);
          }
        }, 1000);
      }
    } catch (error) {
      console.error('❌ Web3Context: Wallet connection failed:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (walletState.tokenService && walletState.walletAddress && walletState.isConnected) {
      console.log('🔄 Web3Context: Auto-initializing balances for connected wallet', {
        hasTokenService: !!walletState.tokenService,
        walletAddress: walletState.walletAddress,
        isConnected: walletState.isConnected
      });
      
      const initializeWithRetry = async (retryCount = 0) => {
        try {
          await initializeBalances(walletState.tokenService, walletState.walletAddress);
          console.log('✅ Web3Context: Auto-initialization successful');
        } catch (error) {
          console.error(`❌ Web3Context: Auto-initialization failed (attempt ${retryCount + 1}):`, error);
          
          if (retryCount < 2) {
            const delay = (retryCount + 1) * 2000;
            console.log(`🔄 Web3Context: Retrying balance initialization in ${delay}ms...`);
            setTimeout(() => initializeWithRetry(retryCount + 1), delay);
          } else {
            console.error('❌ Web3Context: All retry attempts failed, using fallback balances');
          }
        }
      };

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

  console.log('🔍 Web3Context: Providing context value:', {
    isConnected: value.isConnected,
    balance: value.balance,
    strkBalance: value.strkBalance,
    walletAddress: value.walletAddress,
    hasTokenService: !!value.tokenService
  });

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};
