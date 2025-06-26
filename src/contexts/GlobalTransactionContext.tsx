
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface GlobalTransaction {
  id: string;
  type: 'token_issue' | 'token_transfer' | 'token_received';
  amount: string;
  from: string;
  to: string;
  company: string;
  purpose: string;
  date: string;
  time: string;
  status: 'Confirmed' | 'Pending' | 'Failed';
  txHash: string;
  blockNumber?: string;
  gasUsed?: string;
  gasPrice?: string;
  tokenType?: string;
  recipient?: string;
}

interface GlobalTransactionContextType {
  transactions: GlobalTransaction[];
  addTransaction: (transaction: Omit<GlobalTransaction, 'id' | 'date' | 'time'>) => void;
  getTransactionsByCompany: (companyName: string) => GlobalTransaction[];
  getRecentTransactions: (count?: number) => GlobalTransaction[];
}

const GlobalTransactionContext = createContext<GlobalTransactionContextType | undefined>(undefined);

export const useGlobalTransactions = () => {
  const context = useContext(GlobalTransactionContext);
  if (!context) {
    throw new Error('useGlobalTransactions must be used within a GlobalTransactionProvider');
  }
  return context;
};

export const GlobalTransactionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<GlobalTransaction[]>([]);

  const addTransaction = useCallback((transaction: Omit<GlobalTransaction, 'id' | 'date' | 'time'>) => {
    const newTransaction: GlobalTransaction = {
      ...transaction,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString()
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
    console.log('🌍 Global transaction added:', newTransaction);
  }, []);

  const getTransactionsByCompany = useCallback((companyName: string) => {
    return transactions.filter(tx => 
      tx.company === companyName || 
      tx.to === companyName ||
      tx.from === companyName
    );
  }, [transactions]);

  const getRecentTransactions = useCallback((count: number = 10) => {
    return transactions.slice(0, count);
  }, [transactions]);

  const value: GlobalTransactionContextType = {
    transactions,
    addTransaction,
    getTransactionsByCompany,
    getRecentTransactions
  };

  return (
    <GlobalTransactionContext.Provider value={value}>
      {children}
    </GlobalTransactionContext.Provider>
  );
};
