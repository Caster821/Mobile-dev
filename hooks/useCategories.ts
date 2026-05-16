import { useState, useEffect } from 'react';
import { openDatabase } from '../database/database';

export const useCategories = (type?: 'expense' | 'income') => {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    loadCategories();
  }, [type]);

  const loadCategories = async () => {
      try {
          const db = await openDatabase();
          let query = 'SELECT * FROM categories';
          const params: any[] = [];
          if (type) {
              query += ' WHERE type = ?';
              params.push(type);
          }
          const result = await db.getAllAsync(query, params);
          setCategories(result);
      } catch(e) {
          console.error(e);
      }
  };

  return { categories };
};
