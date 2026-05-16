import * as SQLite from 'expo-sqlite';
import { Transaction, Category, Account, Budget, SavingsGoal, RecurringRule } from '../types';

let db: SQLite.SQLiteDatabase;
let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export const openDatabase = async () => {
  if (dbPromise) return dbPromise;

  dbPromise = (async () => {
    try {
      db = await SQLite.openDatabaseAsync('pennywise.db');
      await initializeTables(db);
      return db;
    } catch (error) {
      dbPromise = null; // Reset so we can try again on failure
      throw error;
    }
  })();

  return dbPromise;
};

const initializeTables = async (database: SQLite.SQLiteDatabase) => {
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      icon TEXT NOT NULL,
      color TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('expense','income')),
      is_default INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS accounts (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('cash','checking','savings','credit')),
      starting_balance REAL NOT NULL DEFAULT 0,
      currency TEXT NOT NULL DEFAULT 'USD',
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      amount REAL NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('expense','income','transfer')),
      category_id TEXT,
      account_id TEXT NOT NULL,
      date INTEGER NOT NULL,
      note TEXT,
      receipt_uri TEXT,
      recurring_id TEXT,
      tags TEXT,
      is_deleted INTEGER DEFAULT 0,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (category_id) REFERENCES categories(id),
      FOREIGN KEY (account_id) REFERENCES accounts(id)
    );

    CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
    CREATE INDEX IF NOT EXISTS idx_transactions_account ON transactions(account_id);

    CREATE TABLE IF NOT EXISTS budgets (
      id TEXT PRIMARY KEY,
      category_id TEXT NOT NULL,
      amount REAL NOT NULL,
      method TEXT DEFAULT 'standard',
      month INTEGER NOT NULL,
      year INTEGER NOT NULL,
      rollover_previous INTEGER DEFAULT 0,
      remaining_carried_over REAL DEFAULT 0,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    );

    CREATE TABLE IF NOT EXISTS savings_goals (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      target_amount REAL NOT NULL,
      current_amount REAL DEFAULT 0,
      deadline INTEGER,
      category_id TEXT,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    );

    CREATE TABLE IF NOT EXISTS recurring_rules (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL CHECK(type IN ('expense','income')),
      amount REAL NOT NULL,
      category_id TEXT NOT NULL,
      account_id TEXT NOT NULL,
      frequency TEXT NOT NULL,
      interval INTEGER DEFAULT 1,
      start_date INTEGER NOT NULL,
      end_date INTEGER,
      last_generated INTEGER,
      FOREIGN KEY (category_id) REFERENCES categories(id),
      FOREIGN KEY (account_id) REFERENCES accounts(id)
    );
  `);
  
  const categories = await database.getAllAsync('SELECT * FROM categories');
  if (categories.length === 0) {
    await seedDefaultCategories(database);
  }
};

const seedDefaultCategories = async (database: SQLite.SQLiteDatabase) => {
  const defaults = [
    { id: 'cat-1', name: 'Food', icon: 'fast-food', color: '#ff9800', type: 'expense' },
    { id: 'cat-2', name: 'Transport', icon: 'car', color: '#2196f3', type: 'expense' },
    { id: 'cat-3', name: 'Housing', icon: 'home', color: '#9c27b0', type: 'expense' },
    { id: 'cat-4', name: 'Salary', icon: 'cash', color: '#4caf50', type: 'income' },
  ];
  
  for (const cat of defaults) {
    await database.runAsync(
      `INSERT INTO categories (id, name, icon, color, type, is_default) VALUES (?, ?, ?, ?, ?, 1)`,
      [cat.id, cat.name, cat.icon, cat.color, cat.type]
    );
  }
};

const safe = (v: any) => v === undefined ? null : v;

export const getTransactions = async (): Promise<any[]> => {
  const db = await openDatabase();
  return await db.getAllAsync(`
    SELECT t.*, c.name as categoryName, c.icon as categoryIcon, c.color as categoryColor 
    FROM transactions t 
    LEFT JOIN categories c ON t.category_id = c.id 
    WHERE t.is_deleted = 0 
    ORDER BY t.date DESC
  `);
};

export const insertTransaction = async (t: Transaction) => {
  const db = await openDatabase();
  await db.runAsync(
    `INSERT INTO transactions (id, amount, type, category_id, account_id, date, note, receipt_uri, recurring_id, tags, is_deleted, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)`,
    [t.id, t.amount, t.type, safe(t.category_id), t.account_id, t.date, safe(t.note), safe(t.receipt_uri), safe(t.recurring_id), safe(t.tags), t.created_at]
  );
};

export const updateTransaction = async (t: Transaction) => {
  const db = await openDatabase();
  await db.runAsync(
    `UPDATE transactions SET amount=?, type=?, category_id=?, account_id=?, date=?, note=?, receipt_uri=?, recurring_id=?, tags=? WHERE id=?`,
    [t.amount, t.type, safe(t.category_id), t.account_id, t.date, safe(t.note), safe(t.receipt_uri), safe(t.recurring_id), safe(t.tags), t.id]
  );
};

export const deleteTransaction = async (id: string) => {
  const db = await openDatabase();
  await db.runAsync(`UPDATE transactions SET is_deleted = 1 WHERE id = ?`, [id]);
};

export const getAccounts = async (): Promise<Account[]> => {
  const db = await openDatabase();
  return await db.getAllAsync(`SELECT * FROM accounts`);
};

export const getNetWorth = async (): Promise<number> => {
  const db = await openDatabase();
  
  // Separate queries are more stable on Android than complex nested math
  const accountsRes = await db.getAllAsync<any>(`SELECT SUM(starting_balance) as total FROM accounts`);
  const transactionsRes = await db.getAllAsync<any>(`
    SELECT SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END) as total 
    FROM transactions 
    WHERE type != 'transfer' AND is_deleted = 0
  `);

  const startingTotal = accountsRes[0]?.total || 0;
  const transactionTotal = transactionsRes[0]?.total || 0;

  return startingTotal + transactionTotal;
};

export const getDashboardData = async (month: number, year: number) => {
  const db = await openDatabase();
  const startOfMonth = new Date(year, month - 1, 1).getTime();
  const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999).getTime();

  const res = await db.getAllAsync<any>(`
    SELECT 
      SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income,
      SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expense
    FROM transactions 
    WHERE type != 'transfer' AND is_deleted = 0 
    AND date >= ? AND date <= ?
  `, [startOfMonth, endOfMonth]);
  
  return {
    income: res[0]?.income || 0,
    expense: res[0]?.expense || 0
  };
};

export const insertAccount = async (a: Account) => {
  const db = await openDatabase();
  await db.runAsync(
    `INSERT INTO accounts (id, name, type, starting_balance, currency, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
    [a.id, a.name, a.type, a.starting_balance, a.currency, a.created_at]
  );
};

export const getCategories = async (type?: 'expense' | 'income'): Promise<Category[]> => {
  const db = await openDatabase();
  if (type) {
    return await db.getAllAsync(`SELECT * FROM categories WHERE type = ?`, [type]);
  }
  return await db.getAllAsync(`SELECT * FROM categories`);
};

export const getBudgets = async (month: number, year: number): Promise<Budget[]> => {
  const db = await openDatabase();
  return await db.getAllAsync(`SELECT * FROM budgets WHERE month = ? AND year = ?`, [month, year]);
};

export const insertBudget = async (b: Budget) => {
  const db = await openDatabase();
  await db.runAsync(
    `INSERT INTO budgets (id, category_id, amount, method, month, year, rollover_previous, remaining_carried_over) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [b.id, b.category_id, b.amount, safe(b.method), b.month, b.year, safe(b.rollover_previous), safe(b.remaining_carried_over)]
  );
};

export const getGoals = async (): Promise<SavingsGoal[]> => {
  const db = await openDatabase();
  return await db.getAllAsync(`SELECT * FROM savings_goals`);
};

export const insertGoal = async (g: SavingsGoal) => {
  const db = await openDatabase();
  await db.runAsync(
    `INSERT INTO savings_goals (id, name, target_amount, current_amount, deadline, category_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [g.id, g.name, g.target_amount, safe(g.current_amount), safe(g.deadline), safe(g.category_id), g.created_at]
  );
};

export const getRecurringRules = async (): Promise<RecurringRule[]> => {
  const db = await openDatabase();
  return await db.getAllAsync(`SELECT * FROM recurring_rules`);
};

export const updateLastGenerated = async (id: string, timestamp: number) => {
  const db = await openDatabase();
  await db.runAsync(`UPDATE recurring_rules SET last_generated = ? WHERE id = ?`, [timestamp, id]);
};