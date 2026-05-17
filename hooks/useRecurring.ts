import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getRecurringRules,
  insertRecurringRule,
  deleteRecurringRule,
  updateRecurringRule,
} from '../database/database';
import { RecurringRule } from '../types';

export const useRecurring = () => {
  const { user } = useAuth();
  const [rules, setRules] = useState<RecurringRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await getRecurringRules(user.id);
      setRules(data);
    } catch (e) {
      console.error('Failed to load recurring rules:', e);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addRule = async (rule: any) => {
    if (!user) return;
    const res = await insertRecurringRule({ ...rule, userId: user.id });
    await refresh();
    return res;
  };

  const removeRule = async (id: string) => {
    if (!user) return;
    await deleteRecurringRule(id, user.id);
    await refresh();
  };

  const editRule = async (rule: any) => {
    if (!user) return;
    const res = await updateRecurringRule({ ...rule, userId: user.id });
    await refresh();
    return res;
  };

  return {
    rules,
    isLoading,
    refresh,
    addRule,
    deleteRule: removeRule,
    updateRule: editRule,
  };
};
