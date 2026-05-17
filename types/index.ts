export interface Category {
  _id: string;
  userId?: string;
  name: string;
  icon: string;
  color: string;
  type: 'expense' | 'income';
  isDefault: boolean;
}

export interface Account {
  _id: string;
  userId: string;
  name: string;
  type: 'cash' | 'checking' | 'savings' | 'credit';
  startingBalance: number;
  currency: string;
}

export interface Transaction {
  _id: string;
  userId: string;
  amount: number;
  type: 'expense' | 'income' | 'transfer';
  categoryId: string;
  accountId: string;
  date: number;
  note?: string;
  receiptUri?: string;
  recurringId?: string;
  tags?: string[];
  isDeleted: boolean;
  updatedAt: number;
}

export interface Budget {
  _id: string;
  userId: string;
  categoryId: string;
  amount: number;
  method: string;
  month: number;
  year: number;
  rolloverPrevious: boolean;
  remainingCarriedOver: number;
}

export interface SavingsGoal {
  _id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string | null;
  categoryId?: string;
  icon?: string;
  color?: string;
}

export interface RecurringRule {
  _id: string;
  userId: string;
  type: 'expense' | 'income';
  amount: number;
  categoryId: string;
  accountId: string;
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'yearly';
  interval: number;
  startDate: number;
  endDate?: number;
  lastGenerated?: number;
}
