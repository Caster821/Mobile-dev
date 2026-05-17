import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTransactions, insertTransaction, deleteTransaction } from '../database/database';

export const useTransactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<{
    today: any[], yesterday: any[], thisWeek: any[], older: any[]
  }>({ today: [], yesterday: [], thisWeek: [], older: [] });
  const [rawTransactions, setRawTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await getTransactions(user.id);
      setRawTransactions(data);
      
      // Date grouping logic
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const yesterday = today - 86400000;
      const weekAgo = today - 86400000 * 7;

      const grouped = {
        today: data.filter(t => {
          const txTime = typeof t.date === 'number' ? t.date : new Date(t.date).getTime();
          return txTime >= today;
        }),
        yesterday: data.filter(t => {
          const txTime = typeof t.date === 'number' ? t.date : new Date(t.date).getTime();
          return txTime >= yesterday && txTime < today;
        }),
        thisWeek: data.filter(t => {
          const txTime = typeof t.date === 'number' ? t.date : new Date(t.date).getTime();
          return txTime >= weekAgo && txTime < yesterday;
        }),
        older: data.filter(t => {
          const txTime = typeof t.date === 'number' ? t.date : new Date(t.date).getTime();
          return txTime < weekAgo;
        }),
      };
      
      setTransactions(grouped);
    } catch (e) {
      console.error('Failed to load transactions:', e);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addTransaction = async (data: any) => {
    if (!user) return;
    const res = await insertTransaction({ ...data, userId: user.id });
    await refresh();
    return res;
  };

  const removeTransaction = async (id: string) => {
    if (!user) return;
    const res = await deleteTransaction(id, user.id);
    await refresh();
    return res;
  };

  return {
    transactions,
    rawTransactions,
    isLoading,
    refresh,
    addTransaction,
    deleteTransaction: removeTransaction,
  };
};
