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

  const setFallbackBalances = useCallback(() => {
    const fallbackCat = process.env.NODE_ENV === 'development' ? '1,250.50' : '0';
    const fallbackStrk = process.env.NODE_ENV === 'development' ? '45.75' : '0';
    
    console.log('🔄 Setting fallback balances in useTokenOperations:', {
      CAT: fallbackCat,
      STRK: fallbackStrk,
      environment: process.env.NODE_ENV
    });
    
    setTokenState(prev => ({
      ...prev,
      balance: fallbackCat,
      strkBalance: fallbackStrk
    }));
  }, []);

  const refreshBalance = useCallback(async () => {
    if (!tokenService || !walletAddress) {
      console.log('⚠️ Cannot refresh balance - missing tokenService or walletAddress');
      setFallbackBalances();
      return;
    }
    
    try {
      console.log('🔄 Refreshing token balances...');
      const balances = await tokenService.getAllBalances(walletAddress);
      
      console.log('📊 Balance update from TokenService:', {
        CAT: `${balances.cat.formatted} (numeric: ${balances.cat.numericValue}, real: ${balances.cat.isRealData})`,
        STRK: `${balances.strk.formatted} (numeric: ${balances.strk.numericValue}, real: ${balances.strk.isRealData})`
      });
      
      setTokenState(prev => ({
        ...prev,
        balance: balances.cat.formatted,
        strkBalance: balances.strk.formatted
      }));
      
      console.log('✅ Token balances refreshed successfully in useTokenOperations');
    } catch (error) {
      console.error('❌ Error refreshing balances in useTokenOperations:', error);
      setFallbackBalances();
    }
  }, [tokenService, walletAddress, setFallbackBalances]);

  const initializeBalances = useCallback(async (service: TokenService, address: string) => {
    console.log('🔄 Initializing token balances in useTokenOperations...');
    
    try {
      const balances = await service.getAllBalances(address);
      
      console.log('📊 Balance initialization from TokenService:', {
        CAT: `${balances.cat.formatted} (numeric: ${balances.cat.numericValue}, real: ${balances.cat.isRealData})`,
        STRK: `${balances.strk.formatted} (numeric: ${balances.strk.numericValue}, real: ${balances.strk.isRealData})`
      });
      
      setTokenState(prev => ({
        ...prev,
        balance: balances.cat.formatted,
        strkBalance: balances.strk.formatted
      }));
      
      console.log('✅ Token balances initialized successfully in useTokenOperations');
    } catch (error) {
      console.error('❌ Error initializing token balances in useTokenOperations:', error);
      setFallbackBalances();
    }
  }, [setFallbackBalances]);

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

  return {
    tokenState,
    refreshBalance,
    issueTokens,
    transferTokens,
    initializeBalances
  };
};
