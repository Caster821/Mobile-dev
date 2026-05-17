import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAccounts, insertAccount, seedDefaultAccounts } from '../database/database';
import { Account } from '../types';

export const useAccounts = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {

      await seedDefaultAccounts(user.id);
      const data = await getAccounts(user.id);
      setAccounts(data);
    } catch (e) {
      console.error('Failed to load accounts:', e);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addAccount = async (account: Partial<Account>) => {
    if (!user) return;
    const res = await insertAccount({ ...account, userId: user.id });
    await refresh();
    return res;
  };

  return {
    accounts,
    isLoading,
    refresh,
    addAccount,
  };
};
