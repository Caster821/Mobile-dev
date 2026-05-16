import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { getTransactions } from '../database/database';
import { groupByDate } from '../utils/dateHelpers';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<any>({ today: [], yesterday: [], thisWeek: [], older: [] });
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
      return () => {};
    }, [])
  );

  const loadTransactions = async () => {
    setLoading(true);
    try {
        const data = await getTransactions();
        const grouped = groupByDate(data);
        setTransactions(grouped);
    } catch(e) {
        console.error(e);
    }
    setLoading(false);
  };

  return { transactions, loading, refresh: loadTransactions };
};
