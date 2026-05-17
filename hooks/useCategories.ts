import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getCategories, seedDefaultCategories, deleteCategory } from '../database/database';
import { Category } from '../types';

export const useCategories = (type?: 'expense' | 'income') => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {

      await seedDefaultCategories(user.id);
      const data = await getCategories(user.id, type);
      setCategories(data);
    } catch (e) {
      console.error('Failed to load categories:', e);
    } finally {
      setIsLoading(false);
    }
  }, [user, type]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const removeCategory = async (id: string) => {
    if (!user) return;
    await deleteCategory(id, user.id);
    await refresh();
  };

  return {
    categories,
    isLoading,
    refresh,
    deleteCategory: removeCategory,
  };
};
