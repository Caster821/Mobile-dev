import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import * as database from '../database/database';

export const useSync = () => {
  const { user } = useAuth();
  const [syncing, setSyncing] = useState(false);

  const sync = async () => {
    if (!user || syncing) return;
    setSyncing(true);
    
    try {
      // 1. Fetch local data updated since last sync (simplified: fetch all for now and upsert)
      const transactions = await database.getTransactions(user.id);
      
      // 2. Upsert to Supabase
      if (transactions.length > 0) {
        const { error } = await supabase
          .from('transactions')
          .upsert(transactions.map(tx => ({
            id: tx.id,
            user_id: user.id,
            amount: tx.amount,
            type: tx.type,
            category_id: tx.category_id,
            account_id: tx.account_id,
            date: tx.date,
            note: tx.note,
            is_deleted: tx.is_deleted,
            created_at: new Date(tx.created_at).toISOString(),
            updated_at: new Date(tx.updated_at).toISOString(),
          })));
        
        if (error) console.error('Sync error:', error);
      }

      // Repeat for other tables as needed...
      
    } catch (e) {
      console.error('Sync failed', e);
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    // Initial sync
    sync();
    
    // Subscribe to local changes if we had an event emitter, 
    // but for now we'll just sync on focus or manual trigger
  }, [user]);

  return { sync, syncing };
};
