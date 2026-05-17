import React, { createContext, useContext, useState, useCallback } from 'react';
import { Transaction } from '../types';
import { getTransactions } from '../database/database';

interface TransactionContextType {
  transactions: Transaction[];
  loading: boolean;
  refreshTransactions: () => Promise<void>;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider = ({ children }: { children: React.ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshTransactions = useCallback(async () => {
    setLoading(true);
    try {
      // Note: userId needs to be provided - consider adding user context
      // For now, this will need to be updated to pass the userId
      // const data = await getTransactions(userId);
      const data: Transaction[] = [];
      setTransactions(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, []);

  return (
    <TransactionContext.Provider value={{ transactions, loading, refreshTransactions }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactionContext = () => {
  const context = useContext(TransactionContext);
  if (!context) throw new Error('useTransactionContext must be used within TransactionProvider');
  return context;
};
