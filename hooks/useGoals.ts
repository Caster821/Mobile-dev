import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getGoals, insertGoal, contributeToGoal } from '../database/database';
import { SavingsGoal } from '../types';

export const useGoals = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await getGoals(user.id);
      setGoals(data);
    } catch (e) {
      console.error('Failed to load goals:', e);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addGoal = async (g: any) => {
    if (!user) return;
    const res = await insertGoal({ ...g, userId: user.id });
    await refresh();
    return res;
  };

  const contribute = async (goal: SavingsGoal, amount: number) => {
    const res = await contributeToGoal(goal, amount);
    await refresh();
    return res;
  };

  return {
    goals,
    isLoading,
    refresh,
    addGoal,
    contributeToGoal: contribute,
  };
};
