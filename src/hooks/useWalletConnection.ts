
import { useState, useEffect } from 'react';
import { AccountInterface } from 'starknet';
import { detectWallets, connectToWallet, WalletInfo } from '@/utils/walletUtils';
import { TokenService, createTokenService } from '@/services/tokenService';
import { WalletState } from '@/types/web3';

export const useWalletConnection = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    account: null,
    isConnected: false,
    isConnecting: false,
    walletAddress: '',
    chainId: '',
    tokenService: null
  });
  
  const [availableWallets, setAvailableWallets] = useState<WalletInfo[]>([]);

  useEffect(() => {
    const initializeWallets = async () => {
      try {
        const wallets = await detectWallets();
        setAvailableWallets(wallets);
        console.log('✅ Available wallets detected:', wallets);
      } catch (error) {
        console.error('❌ Error initializing wallets:', error);
      }
    };

    initializeWallets();
  }, []);

  const connectWallet = async (walletId?: string) => {
    console.log(`🚀 Starting wallet connection process for: ${walletId || 'auto-detect'}`);
    setWalletState(prev => ({ ...prev, isConnecting: true }));
    
    try {
      let walletInstance;
      
      if (walletId) {
        console.log(`🎯 Connecting to specific wallet: ${walletId}`);
        walletInstance = await connectToWallet(walletId);
      } else {
        const installedWallets = availableWallets.filter(w => w.installed);
        console.log(`🔍 Auto-detecting from installed wallets:`, installedWallets);
        
        if (installedWallets.length > 0) {
          walletInstance = await connectToWallet(installedWallets[0].id);
        } else {
          throw new Error('No wallets available for connection');
        }
      }

      if (!walletInstance?.account) {
        throw new Error('Failed to get wallet account after connection');
      }

      console.log(`🔧 Creating token service for wallet: ${walletInstance.account.address}`);
      
      // Create token service with the connected wallet
      const service = await createTokenService(walletInstance.account, walletInstance.provider);
      
      // Update wallet state with successful connection
      setWalletState({
        account: walletInstance.account,
        walletAddress: walletInstance.account.address,
        isConnected: true,
        isConnecting: false,
        tokenService: service,
        chainId: walletInstance.provider?.chainId || ''
      });
      
      console.log('✅ Wallet connected and token service created:', {
        address: walletInstance.account.address,
        chainId: walletInstance.provider?.chainId,
        hasTokenService: !!service
      });

      return service;
    } catch (error) {
      console.error('❌ Failed to connect wallet:', error);
      
      // Reset connecting state on error
      setWalletState(prev => ({ ...prev, isConnecting: false }));
      
      // Re-throw the error so components can handle it
      throw new Error(`Wallet connection failed: ${error.message}`);
    }
  };

  const disconnectWallet = () => {
    try {
      console.log('🔌 Disconnecting wallet');
      
      setWalletState({
        account: null,
        isConnected: false,
        isConnecting: false,
        walletAddress: '',
        chainId: '',
        tokenService: null
      });
      
      console.log('✅ Wallet disconnected successfully');
    } catch (error) {
      console.error('❌ Error disconnecting wallet:', error);
    }
  };

  return {
    walletState,
    availableWallets,
    connectWallet,
    disconnectWallet
  };
};
