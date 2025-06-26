
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
    if (!tokenService || !walletAddress) {
      console.log('⚠️ Cannot refresh balance - missing tokenService or walletAddress');
      return;
    }
    
    try {
      console.log('🔄 Refreshing token balances...');
      const balances = await tokenService.getAllBalances(walletAddress);
      
      setTokenState(prev => ({
        ...prev,
        balance: balances.cat.formatted,
        strkBalance: balances.strk.formatted
      }));
      
      console.log('✅ Token balances refreshed successfully:', {
        CAT: `${balances.cat.formatted} (numeric: ${balances.cat.numericValue})`,
        STRK: `${balances.strk.formatted} (numeric: ${balances.strk.numericValue})`
      });
    } catch (error) {
      console.error('❌ Error refreshing balances:', error);
      
      // Set fallback balances on error
      const fallbackCat = process.env.NODE_ENV === 'development' ? '1,250.50' : '0';
      const fallbackStrk = process.env.NODE_ENV === 'development' ? '45.75' : '0';
      
      setTokenState(prev => ({
        ...prev,
        balance: fallbackCat,
        strkBalance: fallbackStrk
      }));
      
      console.log('🔄 Set fallback balances due to error:', {
        CAT: fallbackCat,
        STRK: fallbackStrk
      });
    }
  }, [tokenService, walletAddress]);

  const issueTokens = async (recipient: string, amount: string): Promise<TokenMintResult> => {
    if (!tokenService) {
      const error = new Error('Token service unavailable');
      console.error('❌ Cannot issue tokens:', error.message);
      throw error;
    }

    console.log(`🚀 Starting token issuance: ${amount} CAT to ${recipient}`);
    setTokenState(prev => ({ ...prev, isIssuing: true }));
    
    try {
      const result = await tokenService.mintTokens(recipient, amount);
      setTokenState(prev => ({ ...prev, lastMintResult: result }));
      
      // Refresh balance after successful mint (with delay to allow blockchain confirmation)
      setTimeout(() => {
        console.log('⏰ Refreshing balance after mint...');
        refreshBalance();
      }, 5000);
      
      console.log('✅ Tokens issued successfully:', result);
      return result;
      
    } catch (error) {
      console.error('❌ Failed to issue tokens:', error);
      throw error;
    } finally {
      setTokenState(prev => ({ ...prev, isIssuing: false }));
    }
  };

  const transferTokens = async (recipient: string, amount: string): Promise<TokenMintResult> => {
    if (!tokenService) {
      const error = new Error('Token service unavailable');
      console.error('❌ Cannot transfer tokens:', error.message);
      throw error;
    }

    console.log(`💸 Starting token transfer: ${amount} CAT to ${recipient}`);
    setTokenState(prev => ({ ...prev, isIssuing: true }));
    
    try {
      const result = await tokenService.transferTokens(recipient, amount);
      setTokenState(prev => ({ ...prev, lastMintResult: result }));
      
      // Refresh balance after successful transfer (with delay to allow blockchain confirmation)
      setTimeout(() => {
        console.log('⏰ Refreshing balance after transfer...');
        refreshBalance();
      }, 5000);
      
      console.log('✅ Tokens transferred successfully:', result);
      return result;
      
    } catch (error) {
      console.error('❌ Failed to transfer tokens:', error);
      throw error;
    } finally {
      setTokenState(prev => ({ ...prev, isIssuing: false }));
    }
  };

  const initializeBalances = useCallback(async (service: TokenService, address: string) => {
    console.log('🔄 Initializing token balances...');
    
    try {
      const balances = await service.getAllBalances(address);
      
      setTokenState(prev => ({
        ...prev,
        balance: balances.cat.formatted,
        strkBalance: balances.strk.formatted
      }));
      
      console.log('✅ Token balances initialized:', {
        CAT: `${balances.cat.formatted} (numeric: ${balances.cat.numericValue})`,
        STRK: `${balances.strk.formatted} (numeric: ${balances.strk.numericValue})`
      });
    } catch (error) {
      console.error('❌ Error initializing token balances:', error);
      
      // Set environment-specific fallback balances
      const fallbackCat = process.env.NODE_ENV === 'development' ? '1,250.50' : '0';
      const fallbackStrk = process.env.NODE_ENV === 'development' ? '45.75' : '0';
      
      setTokenState(prev => ({
        ...prev,
        balance: fallbackCat,
        strkBalance: fallbackStrk
      }));
      
      console.log('🔄 Set fallback balances after initialization error:', {
        CAT: fallbackCat,
        STRK: fallbackStrk
      });
    }
  }, []);

  return {
    tokenState,
    refreshBalance,
    issueTokens,
    transferTokens,
    initializeBalances
  };
};
