
import { useState, useCallback } from 'react';
import { TokenService, TokenMintResult } from '@/services/tokenService';
import { TokenState } from '@/types/web3';

export const useTokenOperations = (tokenService: TokenService | null, walletAddress: string) => {
  const [tokenState, setTokenState] = useState<TokenState>({
    balance: '0',
    strkBalance: '0',
    isIssuing: false,
    lastMintResult: null
  });

  const refreshBalance = useCallback(async () => {
    if (!tokenService || !walletAddress) return;
    
    try {
      const balances = await tokenService.getAllBalances(walletAddress);
      setTokenState(prev => ({
        ...prev,
        balance: balances.cat.formatted,
        strkBalance: balances.strk.formatted
      }));
      console.log('Token balances refreshed:', {
        CAT: balances.cat.formatted,
        STRK: balances.strk.formatted
      });
    } catch (error) {
      console.error('Error refreshing balances:', error);
    }
  }, [tokenService, walletAddress]);

  const issueTokens = async (recipient: string, amount: string): Promise<TokenMintResult> => {
    if (!tokenService) {
      throw new Error('Token service unavailable');
    }

    setTokenState(prev => ({ ...prev, isIssuing: true }));
    
    try {
      console.log(`Issuing ${amount} CAT tokens to ${recipient}`);
      
      const result = await tokenService.mintTokens(recipient, amount);
      setTokenState(prev => ({ ...prev, lastMintResult: result }));
      
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
      setTokenState(prev => ({ ...prev, isIssuing: false }));
    }
  };

  const initializeBalances = useCallback(async (service: TokenService, address: string) => {
    try {
      const balances = await service.getAllBalances(address);
      setTokenState(prev => ({
        ...prev,
        balance: balances.cat.formatted,
        strkBalance: balances.strk.formatted
      }));
      console.log('Token balances loaded:', {
        CAT: balances.cat.formatted,
        STRK: balances.strk.formatted
      });
    } catch (error) {
      console.error('Error fetching token balances:', error);
      setTokenState(prev => ({
        ...prev,
        balance: process.env.NODE_ENV === 'development' ? '1,250.50' : '0',
        strkBalance: process.env.NODE_ENV === 'development' ? '45.75' : '0'
      }));
    }
  }, []);

  return {
    tokenState,
    refreshBalance,
    issueTokens,
    initializeBalances
  };
};
