import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { getBudgets, getTransactions } from '../database/database';
import { Budget, Transaction } from '../types';

export const useBudgets = (month: number, year: number) => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadData();
      return () => {};
    }, [month, year])
  );

  const loadData = async () => {
    setLoading(true);
    try {
      const fetchedBudgets = await getBudgets(month, year);
      const fetchedTransactions = await getTransactions();
      
      // Filter transactions for this month
      const currentTransactions = fetchedTransactions.filter(t => {
        const d = new Date(t.date);
        return d.getMonth() + 1 === month && d.getFullYear() === year && t.type === 'expense';
      });

      setBudgets(fetchedBudgets);
      setTransactions(currentTransactions);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return { budgets, transactions, loading, refresh: loadData };
};
