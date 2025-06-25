
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { TokenHistoryService, TokenIssuanceRecord } from '@/services/tokenHistoryService';

interface TokenHistoryContextType {
  records: TokenIssuanceRecord[];
  isLoading: boolean;
  refreshHistory: () => Promise<void>;
  addRecord: (record: Omit<TokenIssuanceRecord, 'id' | 'date' | 'time' | 'status'>) => void;
  getTotalIssued: () => number;
  getConfirmedCount: () => number;
}

const TokenHistoryContext = createContext<TokenHistoryContextType | undefined>(undefined);

export const useTokenHistory = () => {
  const context = useContext(TokenHistoryContext);
  if (!context) {
    throw new Error('useTokenHistory must be used within a TokenHistoryProvider');
  }
  return context;
};

interface TokenHistoryProviderProps {
  children: ReactNode;
}

export const TokenHistoryProvider: React.FC<TokenHistoryProviderProps> = ({ children }) => {
  const [records, setRecords] = useState<TokenIssuanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log('🔄 Refreshing token history...');
      const historyService = await TokenHistoryService.create();
      const newRecords = await historyService.getTokenIssuanceHistory();
      setRecords(newRecords);
      console.log('✅ Token history refreshed successfully');
    } catch (error) {
      console.error('❌ Error refreshing token history:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addRecord = useCallback((record: Omit<TokenIssuanceRecord, 'id' | 'date' | 'time' | 'status'>) => {
    const historyService = new TokenHistoryService(null as any); // We don't need provider for this operation
    const newRecord = historyService.addNewIssuance(record);
    
    setRecords(prev => [newRecord, ...prev]);
    console.log('➕ New record added to context:', newRecord);
  }, []);

  const getTotalIssued = useCallback(() => {
    return records.reduce((sum, record) => {
      const amount = parseInt(record.amount.replace(/,/g, ''));
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);
  }, [records]);

  const getConfirmedCount = useCallback(() => {
    return records.filter(record => record.status === 'Confirmed').length;
  }, [records]);

  const value: TokenHistoryContextType = {
    records,
    isLoading,
    refreshHistory,
    addRecord,
    getTotalIssued,
    getConfirmedCount
  };

  return (
    <TokenHistoryContext.Provider value={value}>
      {children}
    </TokenHistoryContext.Provider>
  );
};
