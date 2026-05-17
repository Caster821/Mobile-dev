import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getBudgetStatus, insertBudget } from '../database/database';

export const useBudgets = (month: number, year: number) => {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await getBudgetStatus(user.id, month, year);
      setBudgets(data);
    } catch (e) {
      console.error('Failed to load budgets:', e);
    } finally {
      setIsLoading(false);
    }
  }, [user, month, year]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addBudget = async (b: any) => {
    if (!user) return;
    const res = await insertBudget({ ...b, userId: user.id });
    await refresh();
    return res;
  };

  return {
    budgets,
    isLoading,
    refresh,
    addBudget,
  };
};
