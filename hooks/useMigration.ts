import * as db from '../database/database';
import { useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { useState } from 'react';
import { Alert } from 'react-native';

export const useDataMigration = () => {
  // @ts-ignore - Convex API types may not be fully generated
  const addCategory = useMutation(api.categories.add);
  // @ts-ignore - Convex API types may not be fully generated
  const addAccount = useMutation(api.accounts.add);
  // @ts-ignore - Convex API types may not be fully generated
  const addTransaction = useMutation(api.transactions.add);
  const [migrating, setMigrating] = useState(false);

  const migrate = async (userId: string) => {
    try {
      setMigrating(true);
      
      // 1. Fetch all local data
      const localCategories = await db.getCategories(userId);
      const localAccounts = await db.getAccounts(userId);
      const localTransactions = await db.getTransactions(userId);

      const categoryMap = new Map();
      const accountMap = new Map();

      // 2. Migrate Categories (only non-default ones, or all)
      for (const cat of localCategories) {
        const newId = await addCategory({
          name: cat.name,
          icon: cat.icon,
          color: cat.color,
          type: cat.type as 'income' | 'expense',
        });
        categoryMap.set(cat._id, newId);
      }

      // 3. Migrate Accounts
      for (const acc of localAccounts) {
        const newId = await addAccount({
          name: acc.name,
          type: acc.type as any,
          startingBalance: acc.startingBalance,
          currency: acc.currency,
        });
        accountMap.set(acc._id, newId);
      }

      // 4. Migrate Transactions
      for (const t of localTransactions) {
        await addTransaction({
          amount: t.amount,
          type: t.type as any,
          categoryId: categoryMap.get(t.category_id) || '', // Fallback or handle missing
          accountId: accountMap.get(t.account_id) || '',
          date: t.date,
          note: t.note || undefined,
        });
      }

      Alert.alert('Migration Complete', 'All your local data has been synced to Convex!');
    } catch (e: any) {
      Alert.alert('Migration Failed', e.message);
    } finally {
      setMigrating(false);
    }
  };

  return { migrate, migrating };
};
