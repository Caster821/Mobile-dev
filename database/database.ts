import { supabase } from '../lib/supabase';
import { Transaction, Category, Account, Budget, SavingsGoal, RecurringRule } from '../types';

const safe = (v: any) => v === undefined || v === null ? null : v;

export const seedDefaultCategories = async (userId: string) => {
  try {
    const { data: existing, error: checkError } = await supabase
      .from('categories')
      .select('id')
      .eq('user_id', userId)
      .limit(1);

    if (checkError) throw checkError;
    if (existing && existing.length > 0) return;

    const defaults = [

      { name: 'Food & Dining', icon: 'fast-food', color: '#FF6B6B', type: 'expense' },
      { name: 'Transportation', icon: 'car', color: '#4ECDC4', type: 'expense' },
      { name: 'Housing', icon: 'home', color: '#45B7D1', type: 'expense' },
      { name: 'Utilities', icon: 'bulb', color: '#96CEB4', type: 'expense' },
      { name: 'Healthcare', icon: 'medical', color: '#FFEAA7', type: 'expense' },
      { name: 'Entertainment', icon: 'film', color: '#DDA0DD', type: 'expense' },
      { name: 'Shopping', icon: 'cart', color: '#FDCB6E', type: 'expense' },
      { name: 'Education', icon: 'book', color: '#81ECEC', type: 'expense' },
      { name: 'Personal Care', icon: 'cut', color: '#FF9F43', type: 'expense' },
      { name: 'Clothing', icon: 'shirt', color: '#A8E6CF', type: 'expense' },
      { name: 'Gifts & Donations', icon: 'gift', color: '#FF8B94', type: 'expense' },
      { name: 'Travel', icon: 'airplane', color: '#667EEA', type: 'expense' },
      { name: 'Insurance', icon: 'shield-checkmark', color: '#B8E1FF', type: 'expense' },
      { name: 'Taxes', icon: 'receipt', color: '#E2E8F0', type: 'expense' },
      { name: 'Miscellaneous', icon: 'pin', color: '#A0AEC0', type: 'expense' },

      { name: 'Salary', icon: 'cash', color: '#48BB78', type: 'income' },
      { name: 'Freelance', icon: 'desktop', color: '#ED8936', type: 'income' },
      { name: 'Business', icon: 'business', color: '#9F7AEA', type: 'income' },
      { name: 'Investment', icon: 'trending-up', color: '#38B2AC', type: 'income' },
      { name: 'Gift', icon: 'ribbon', color: '#F687B3', type: 'income' },
    ];

    const seededCategories = defaults.map(cat => ({
      user_id: userId,
      name: cat.name,
      icon: cat.icon,
      color: cat.color,
      type: cat.type,
      is_default: true
    }));

    const { error: insertError } = await supabase
      .from('categories')
      .insert(seededCategories);

    if (insertError) throw insertError;
    console.log('Successfully seeded default categories for:', userId);
  } catch (error) {
    console.error('Failed to seed default categories:', error);
  }
};

export const seedDefaultAccounts = async (userId: string) => {
  try {
    const { data: existing, error: checkError } = await supabase
      .from('accounts')
      .select('id')
      .eq('user_id', userId)
      .limit(1);

    if (checkError) throw checkError;
    if (existing && existing.length > 0) return;

    const defaults = [
      { name: 'Cash', type: 'cash', startingBalance: 0, currency: 'XAF' },
      { name: 'Bank Account', type: 'checking', startingBalance: 0, currency: 'XAF' },
    ];

    const seededAccounts = defaults.map(acc => ({
      user_id: userId,
      name: acc.name,
      type: acc.type,
      starting_balance: acc.startingBalance,
      currency: acc.currency,
    }));

    const { error: insertError } = await supabase
      .from('accounts')
      .insert(seededAccounts);

    if (insertError) throw insertError;
    console.log('Successfully seeded default accounts for:', userId);
  } catch (error) {
    console.error('Failed to seed default accounts:', error);
  }
};

export const updateGoalProgress = async (id: string, current_amount: number, userId: string) => {
  const { data, error } = await supabase
    .from('savings_goals')
    .update({ current_amount: current_amount, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', userId)
    .select();
  
  if (error) throw error;
  return data[0];
};

const mapCategoryFromDb = (data: any): Category => ({
  _id: data.id,
  userId: data.user_id,
  name: data.name,
  icon: data.icon,
  color: data.color,
  type: data.type,
  isDefault: data.is_default || false,
});

export const getCategories = async (userId: string, type?: 'expense' | 'income'): Promise<Category[]> => {
  let query = supabase.from('categories').select('*').or(`user_id.eq.${userId},user_id.is.null`);
  if (type) {
    query = query.eq('type', type);
  }
  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map(mapCategoryFromDb);
};

export const deleteCategory = async (id: string, userId: string) => {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);
  if (error) throw error;
};

export const insertCategory = async (category: any) => {
  const payload = {
    user_id: category.userId || category.user_id,
    name: category.name,
    icon: category.icon,
    color: category.color,
    type: category.type,
  };

  const { data, error } = await supabase
    .from('categories')
    .insert([payload])
    .select();

  if (error) throw error;
  return mapCategoryFromDb(data[0]);
};

const mapAccountFromDb = (data: any): Account => ({
  _id: data.id,
  userId: data.user_id,
  name: data.name,
  type: data.type,
  startingBalance: data.starting_balance || 0,
  currency: data.currency,
});

export const getAccounts = async (userId: string): Promise<Account[]> => {
  const { data, error } = await supabase
    .from('accounts')
    .select('*')
    .eq('user_id', userId);
  if (error) throw error;
  return (data || []).map(mapAccountFromDb);
};

export const insertAccount = async (account: Partial<Account>) => {
  const payload = {
    user_id: account.userId || account.userId,
    name: account.name,
    type: account.type,
    starting_balance: account.startingBalance || 0,
    currency: account.currency,
  };
  const { data, error } = await supabase
    .from('accounts')
    .insert([payload])
    .select();
  if (error) throw error;
  return mapAccountFromDb(data[0]);
};

const mapTransactionFromDb = (data: any): Transaction => ({
  _id: data.id,
  userId: data.user_id,
  amount: data.amount,
  type: data.type,
  categoryId: data.category_id,
  accountId: data.account_id,
  date: data.date ? new Date(data.date).getTime() : Date.now(),
  note: data.note,
  receiptUri: data.receipt_uri,
  recurringId: data.recurring_id,
  tags: data.tags,
  isDeleted: data.is_deleted || false,
  updatedAt: data.updated_at ? new Date(data.updated_at).getTime() : Date.now(),
});

export const getTransactions = async (userId: string): Promise<any[]> => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*, categories(*)')
    .eq('user_id', userId)
    .eq('is_deleted', false)
    .order('date', { ascending: false });
  if (error) throw error;
  return (data || []).map(t => ({
    ...mapTransactionFromDb(t),
    categories: t.categories ? mapCategoryFromDb(t.categories) : null,
    accounts: t.accounts,
  }));
};

export const getTransaction = async (id: string, userId: string): Promise<any> => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*, categories(*), accounts(*)')
    .eq('id', id)
    .eq('user_id', userId)
    .single();
  if (error) throw error;
  return data;
};

export const insertTransaction = async (t: any) => {
  const payload = {
    user_id: t.userId || t.user_id,
    amount: t.amount,
    type: t.type,
    category_id: safe(t.categoryId || t.category_id),
    account_id: t.accountId || t.account_id,
    note: safe(t.note),
    date: t.date ? new Date(t.date).toISOString() : new Date().toISOString(),
    is_deleted: false,
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('transactions')
    .insert([payload])
    .select();
  
  if (error) throw error;
  return mapTransactionFromDb(data[0]);
};

export const updateTransaction = async (t: any) => {
  const payload = {
    amount: t.amount,
    type: t.type,
    category_id: safe(t.categoryId || t.category_id),
    account_id: t.accountId || t.account_id,
    note: safe(t.note),
    date: t.date ? new Date(t.date).toISOString() : new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  let query = supabase
    .from('transactions')
    .update(payload)
    .eq('id', t.id || t._id);

  if (t.userId || t.user_id) {
    query = query.eq('user_id', t.userId || t.user_id);
  }

  const { data, error } = await query.select();

  if (error) throw error;
  return mapTransactionFromDb(data[0]);
};

export const deleteTransaction = async (id: string, userId: string) => {
  const { data, error } = await supabase
    .from('transactions')
    .update({ is_deleted: true, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', userId)
    .select();
  if (error) throw error;
  return data[0];
};

const mapBudgetFromDb = (data: any): Budget => ({
  _id: data.id,
  userId: data.user_id,
  categoryId: data.category_id,
  amount: data.amount,
  method: data.method || 'fixed',
  month: data.month,
  year: data.year,
  rolloverPrevious: data.rollover_previous || false,
  remainingCarriedOver: data.remaining_carried_over || 0,
});

export const getBudgets = async (userId: string, month: number, year: number): Promise<Budget[]> => {
  const { data, error } = await supabase
    .from('budgets')
    .select('*')
    .eq('user_id', userId)
    .eq('month', month)
    .eq('year', year);
  if (error) throw error;
  return (data || []).map(mapBudgetFromDb);
};

export const insertBudget = async (b: any) => {
  const payload = {
    user_id: b.userId || b.user_id,
    category_id: b.categoryId || b.category_id,
    amount: b.amount,
    month: b.month,
    year: b.year
  };

  const { data, error } = await supabase
    .from('budgets')
    .insert([payload])
    .select();
  if (error) throw error;
  return mapBudgetFromDb(data[0]);
};

export const deleteBudget = async (id: string, userId: string) => {
  const { error } = await supabase
    .from('budgets')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);
  if (error) throw error;
};

export const getBudget = async (id: string, userId: string): Promise<Budget> => {
  const { data, error } = await supabase
    .from('budgets')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();
  if (error) throw error;
  return mapBudgetFromDb(data);
};

export const updateBudget = async (b: any) => {
  const payload = {
    category_id: b.categoryId || b.category_id,
    amount: b.amount,
    month: b.month,
    year: b.year,
  };
  const { data, error } = await supabase
    .from('budgets')
    .update(payload)
    .eq('id', b._id || b.id)
    .eq('user_id', b.userId || b.user_id)
    .select();
  if (error) throw error;
  return mapBudgetFromDb(data[0]);
};

const mapGoalFromDb = (data: any): SavingsGoal => ({
  _id: data.id,
  userId: data.user_id,
  name: data.name,
  targetAmount: data.target_amount,
  currentAmount: data.current_amount,
  deadline: data.deadline,
  categoryId: data.category_id,
  icon: data.icon,
  color: data.color,
});

export const getGoals = async (userId: string): Promise<SavingsGoal[]> => {
  const { data, error } = await supabase
    .from('savings_goals')
    .select('*')
    .eq('user_id', userId);
  if (error) throw error;
  return (data || []).map(mapGoalFromDb);
};

export const deleteGoal = async (id: string, userId: string) => {
  const { error } = await supabase
    .from('savings_goals')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);
  if (error) throw error;
};

export const insertGoal = async (g: any) => {
  const payload = {
    user_id: g.userId || g.user_id,
    name: g.name,
    target_amount: g.targetAmount || g.target_amount,
    current_amount: g.currentAmount || g.current_amount || 0,
    deadline: g.deadline ? new Date(g.deadline).toISOString().split('T')[0] : null,
    icon: g.icon || 'flag',
    color: g.color || '#2e7d32'
  };

  const { data, error } = await supabase
    .from('savings_goals')
    .insert([payload])
    .select();
  if (error) throw error;
  return mapGoalFromDb(data[0]);
};

export const getGoal = async (id: string, userId: string): Promise<SavingsGoal> => {
  const { data, error } = await supabase
    .from('savings_goals')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();
  if (error) throw error;
  return mapGoalFromDb(data);
};

export const updateGoal = async (g: any) => {
  const payload: Record<string, unknown> = {
    name: g.name,
    target_amount: g.targetAmount ?? g.target_amount,
    updated_at: new Date().toISOString(),
  };
  if (g.currentAmount !== undefined || g.current_amount !== undefined) {
    payload.current_amount = g.currentAmount ?? g.current_amount;
  }
  if (g.deadline !== undefined) {
    payload.deadline = g.deadline
      ? new Date(g.deadline).toISOString().split('T')[0]
      : null;
  }
  const { data, error } = await supabase
    .from('savings_goals')
    .update(payload)
    .eq('id', g._id || g.id)
    .eq('user_id', g.userId || g.user_id)
    .select();
  if (error) throw error;
  return mapGoalFromDb(data[0]);
};

export const contributeToGoal = async (goal: SavingsGoal, amount: number) => {
  const newAmount = (goal.currentAmount || 0) + amount;
  const { data, error } = await supabase
    .from('savings_goals')
    .update({ current_amount: newAmount, updated_at: new Date().toISOString() })
    .eq('id', goal._id)
    .select();
  if (error) throw error;
  return mapGoalFromDb(data[0]);
};

const mapRecurringFromDb = (data: any): RecurringRule => ({
  _id: data.id,
  userId: data.user_id,
  type: data.type,
  amount: data.amount,
  categoryId: data.category_id,
  accountId: data.account_id,
  frequency: data.frequency,
  interval: data.interval || 1,
  startDate: data.start_date ? new Date(data.start_date).getTime() : Date.now(),
  endDate: data.end_date ? new Date(data.end_date).getTime() : undefined,
  lastGenerated: data.last_generated ? new Date(data.last_generated).getTime() : undefined,
});

export const getRecurringRules = async (userId: string): Promise<RecurringRule[]> => {
  const { data, error } = await supabase
    .from('recurring_rules')
    .select('*')
    .eq('user_id', userId)
    .order('start_date', { ascending: false });
  if (error) throw error;
  return (data || []).map(mapRecurringFromDb);
};

export const insertRecurringRule = async (rule: any) => {
  const payload = {
    user_id: rule.userId || rule.user_id,
    type: rule.type,
    amount: rule.amount,
    category_id: rule.categoryId || rule.category_id,
    account_id: rule.accountId || rule.account_id,
    frequency: rule.frequency,
    interval: rule.interval || 1,
    start_date: rule.startDate
      ? new Date(rule.startDate).toISOString()
      : new Date().toISOString(),
    end_date: rule.endDate ? new Date(rule.endDate).toISOString() : null,
  };
  const { data, error } = await supabase
    .from('recurring_rules')
    .insert([payload])
    .select();
  if (error) throw error;
  return mapRecurringFromDb(data[0]);
};

export const deleteRecurringRule = async (id: string, userId: string) => {
  const { error } = await supabase
    .from('recurring_rules')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);
  if (error) throw error;
};

export const updateRecurringRule = async (rule: any) => {
  const payload = {
    type: rule.type,
    amount: rule.amount,
    category_id: rule.categoryId || rule.category_id,
    account_id: rule.accountId || rule.account_id,
    frequency: rule.frequency,
    interval: rule.interval || 1,
    start_date: rule.startDate ? new Date(rule.startDate).toISOString() : undefined,
    end_date: rule.endDate ? new Date(rule.endDate).toISOString() : null,
  };
  const { data, error } = await supabase
    .from('recurring_rules')
    .update(payload)
    .eq('id', rule._id || rule.id)
    .eq('user_id', rule.userId || rule.user_id)
    .select();
  if (error) throw error;
  return mapRecurringFromDb(data[0]);
};

export const getNetWorth = async (userId: string): Promise<number> => {

  const { data: accounts, error: accError } = await supabase
    .from('accounts')
    .select('starting_balance')
    .eq('user_id', userId);

  if (accError) throw accError;

  const { data: transactions, error: txError } = await supabase
    .from('transactions')
    .select('amount, type')
    .eq('user_id', userId)
    .eq('is_deleted', false);

  if (txError) throw txError;

  const initialBalance = accounts?.reduce((sum, a) => sum + Number(a.starting_balance), 0) || 0;
  const flow = transactions?.reduce((sum, t) => {
    if (t.type === 'income') return sum + Number(t.amount);
    if (t.type === 'expense') return sum - Number(t.amount);
    return sum;
  }, 0) || 0;

  return initialBalance + flow;
};

export const getDashboardData = async (userId: string, month: number, year: number) => {
  const startOfMonth = new Date(year, month - 1, 1).toISOString();
  const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999).toISOString();

  const { data, error } = await supabase
    .from('transactions')
    .select('amount, type')
    .eq('user_id', userId)
    .eq('is_deleted', false)
    .gte('date', startOfMonth)
    .lte('date', endOfMonth);

  if (error) throw error;

  const income = data?.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0) || 0;
  const expense = data?.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0) || 0;

  return { income, expense };
};

export const getBudgetStatus = async (userId: string, month: number, year: number) => {
  const budgets = await getBudgets(userId, month, year);
  
  const startOfMonth = new Date(year, month - 1, 1).toISOString();
  const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999).toISOString();

  const { data: transactions, error } = await supabase
    .from('transactions')
    .select('amount, category_id')
    .eq('user_id', userId)
    .eq('type', 'expense')
    .eq('is_deleted', false)
    .gte('date', startOfMonth)
    .lte('date', endOfMonth);

  if (error) throw error;

  const statusList = budgets.map(b => {
    const spent = transactions
      ?.filter(t => t.category_id === b.categoryId)
      .reduce((sum, t) => sum + Number(t.amount), 0) || 0;
    
    return {
      _id: b._id,
      categoryId: b.categoryId,
      amount: b.amount,
      spent,
      progress: b.amount > 0 ? Math.min(spent / b.amount, 1) : 0
    };
  });

  return statusList;
};