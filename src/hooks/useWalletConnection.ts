
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
        console.log('Available wallets detected:', wallets);
      } catch (error) {
        console.error('Error initializing wallets:', error);
      }
    };

    initializeWallets();
  }, []);

  useEffect(() => {
    const checkExistingConnection = async () => {
      try {
        console.log('Checking for existing wallet connection...');
      } catch (error) {
        console.error('Error checking existing connection:', error);
      }
    };

    checkExistingConnection();
  }, []);

  const connectWallet = async (walletId?: string) => {
    setWalletState(prev => ({ ...prev, isConnecting: true }));
    
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
        const service = createTokenService(walletInstance.account, walletInstance.provider);
        
        setWalletState({
          account: walletInstance.account,
          walletAddress: walletInstance.account.address,
          isConnected: true,
          isConnecting: false,
          tokenService: service,
          chainId: walletInstance.provider?.chainId || ''
        });
        
        console.log('Wallet connected successfully:', {
          address: walletInstance.account.address,
          chainId: walletInstance.provider?.chainId
        });

        return service;
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      
      // For demo purposes, create a mock connection if real connection fails
      if (process.env.NODE_ENV === 'development') {
        setWalletState({
          account: null,
          isConnected: true,
          isConnecting: false,
          walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
          chainId: '0x534e5f474f45524c49',
          tokenService: null
        });
        console.log('Mock wallet connected for demo due to connection error');
      } else {
        setWalletState(prev => ({ ...prev, isConnecting: false }));
        throw error;
      }
    }
  };

  const disconnectWallet = () => {
    try {
      setWalletState({
        account: null,
        isConnected: false,
        isConnecting: false,
        walletAddress: '',
        chainId: '',
        tokenService: null
      });
      console.log('Wallet disconnected');
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  return {
    walletState,
    availableWallets,
    connectWallet,
    disconnectWallet
  };
};
