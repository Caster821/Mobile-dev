export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: 'expense' | 'income';
  is_default: number;
}

export interface Account {
  id: string;
  name: string;
  type: 'cash' | 'checking' | 'savings' | 'credit';
  starting_balance: number;
  currency: string;
  created_at: number;
}

export interface Transaction {
  id: string;
  amount: number;
  type: 'expense' | 'income' | 'transfer';
  category_id: string | null;
  account_id: string;
  date: number;
  note: string | null;
  receipt_uri: string | null;
  recurring_id: string | null;
  tags: string | null;
  is_deleted: number;
  created_at: number;
}

export interface Budget {
  id: string;
  category_id: string;
  amount: number;
  method: string;
  month: number;
  year: number;
  rollover_previous: number;
  remaining_carried_over: number;
}

export interface SavingsGoal {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: number | null;
  category_id: string | null;
  icon?: string;
  color?: string;
  created_at: number;
}

export interface RecurringRule {
  id: string;
  type: 'expense' | 'income';
  amount: number;
  category_id: string;
  account_id: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  start_date: number;
  end_date: number | null;
  last_generated: number | null;
}
