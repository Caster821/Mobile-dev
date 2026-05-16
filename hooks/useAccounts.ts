import { useState, useEffect } from 'react';
import { openDatabase } from '../database/database';

export const useAccounts = () => {
  const [accounts, setAccounts] = useState<any[]>([]);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
      try {
          const db = await openDatabase();
          const result = await db.getAllAsync('SELECT * FROM accounts');
          if (result.length === 0) {
              // Create default account if none exists
              await db.runAsync("INSERT INTO accounts (id, name, type, starting_balance, currency, created_at) VALUES ('acc-1', 'Main Checking', 'checking', 0, 'USD', ?)", [Date.now()]);
              setAccounts([{ id: 'acc-1', name: 'Main Checking', type: 'checking' }]);
          } else {
              setAccounts(result);
          }
      } catch(e) {
          console.error(e);
      }
  };

  return { accounts };
};
