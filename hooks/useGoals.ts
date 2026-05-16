import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { getGoals } from '../database/database';
import { SavingsGoal } from '../types';

export const useGoals = () => {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadGoals();
      return () => {};
    }, [])
  );

  const loadGoals = async () => {
    setLoading(true);
    try {
      const fetched = await getGoals();
      setGoals(fetched);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return { goals, loading, refresh: loadGoals };
};
