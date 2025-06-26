
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface TokenTransfer {
  id: string;
  vendor: string;
  amount: string;
  purpose: string;
  date: string;
  time: string;
  status: 'Confirmed' | 'Pending' | 'Failed';
  txHash: string;
  type: 'transfer';
}

export interface TokenReceived {
  id: string;
  from: string;
  amount: string;
  purpose: string;
  date: string;
  time: string;
  status: 'Confirmed' | 'Pending' | 'Failed';
  txHash: string;
  type: 'received';
}

export interface CATRequest {
  id: string;
  amount: string;
  purpose: string;
  documents: string[];
  date: string;
  time: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  type: 'cat_request';
}

export interface ActiveVendor {
  id: string;
  name: string;
  contractValue: string;
  catTokens: string;
  status: 'Active' | 'Inactive';
  contractDate: string;
}

interface CompanyDashboardContextType {
  tokenTransfers: TokenTransfer[];
  tokensReceived: TokenReceived[];
  catRequests: CATRequest[];
  activeVendors: ActiveVendor[];
  addTokenTransfer: (transfer: Omit<TokenTransfer, 'id' | 'date' | 'time' | 'status' | 'type'>) => void;
  addTokenReceived: (received: Omit<TokenReceived, 'id' | 'date' | 'time' | 'status' | 'type'>) => void;
  addCATRequest: (request: Omit<CATRequest, 'id' | 'date' | 'time' | 'status' | 'type'>) => void;
  getAllTransactions: () => (TokenTransfer | TokenReceived | CATRequest)[];
}

const CompanyDashboardContext = createContext<CompanyDashboardContextType | undefined>(undefined);

export const useCompanyDashboard = () => {
  const context = useContext(CompanyDashboardContext);
  if (!context) {
    throw new Error('useCompanyDashboard must be used within a CompanyDashboardProvider');
  }
  return context;
};

export const CompanyDashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Mock initial data
  const [tokenTransfers, setTokenTransfers] = useState<TokenTransfer[]>([
    {
      id: '1',
      vendor: "ABC Manufacturing Ltd",
      amount: "25,000",
      purpose: "Raw Materials",
      date: "2024-01-15",
      time: "14:30",
      status: "Confirmed",
      txHash: "0x1234...abcd",
      type: 'transfer'
    }
  ]);

  const [tokensReceived, setTokensReceived] = useState<TokenReceived[]>([
    {
      id: '1',
      from: "HDFC Bank",
      amount: "100,000",
      purpose: "Initial CAT Token Allocation",
      date: "2024-01-14",
      time: "10:00",
      status: "Confirmed",
      txHash: "0x5678...efgh",
      type: 'received'
    }
  ]);

  const [catRequests, setCatRequests] = useState<CATRequest[]>([]);

  const [activeVendors, setActiveVendors] = useState<ActiveVendor[]>([
    {
      id: '1',
      name: "ABC Manufacturing Ltd",
      contractValue: "₹2,50,000",
      catTokens: "25,000",
      status: "Active",
      contractDate: "2024-01-10"
    },
    {
      id: '2',
      name: "XYZ Logistics Co",
      contractValue: "₹1,50,000",
      catTokens: "15,000",
      status: "Active",
      contractDate: "2024-01-12"
    },
    {
      id: '3',
      name: "Tech Solutions Inc",
      contractValue: "₹3,50,000",
      catTokens: "35,000",
      status: "Active",
      contractDate: "2024-01-08"
    }
  ]);

  const addTokenTransfer = useCallback((transfer: Omit<TokenTransfer, 'id' | 'date' | 'time' | 'status' | 'type'>) => {
    const newTransfer: TokenTransfer = {
      ...transfer,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString(),
      status: 'Pending',
      type: 'transfer'
    };
    setTokenTransfers(prev => [newTransfer, ...prev]);
  }, []);

  const addTokenReceived = useCallback((received: Omit<TokenReceived, 'id' | 'date' | 'time' | 'status' | 'type'>) => {
    const newReceived: TokenReceived = {
      ...received,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString(),
      status: 'Confirmed',
      type: 'received'
    };
    setTokensReceived(prev => [newReceived, ...prev]);
  }, []);

  const addCATRequest = useCallback((request: Omit<CATRequest, 'id' | 'date' | 'time' | 'status' | 'type'>) => {
    const newRequest: CATRequest = {
      ...request,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString(),
      status: 'Pending',
      type: 'cat_request'
    };
    setCatRequests(prev => [newRequest, ...prev]);
  }, []);

  const getAllTransactions = useCallback(() => {
    const allTransactions = [
      ...tokenTransfers,
      ...tokensReceived,
      ...catRequests
    ];
    return allTransactions.sort((a, b) => new Date(b.date + ' ' + b.time).getTime() - new Date(a.date + ' ' + a.time).getTime());
  }, [tokenTransfers, tokensReceived, catRequests]);

  const value: CompanyDashboardContextType = {
    tokenTransfers,
    tokensReceived,
    catRequests,
    activeVendors,
    addTokenTransfer,
    addTokenReceived,
    addCATRequest,
    getAllTransactions
  };

  return (
    <CompanyDashboardContext.Provider value={value}>
      {children}
    </CompanyDashboardContext.Provider>
  );
};
