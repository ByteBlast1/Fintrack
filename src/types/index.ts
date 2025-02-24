export interface Transaction {
  id: string;
  date: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
}

export interface TransactionsState {
  transactions: Transaction[];
}

export interface ThemeState {
  mode: 'light' | 'dark';
}

export interface RootState {
  theme: ThemeState;
  transactions: TransactionsState;
  reminders: RemindersState;
  goals: GoalsState;
}

export interface RemindersState {
  reminders: Reminder[];
}

export interface GoalsState {
  goals: Goal[];
}

export interface Reminder {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  frequency: 'monthly' | 'weekly' | 'yearly';
  isRecurring: boolean;
}

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: 'savings' | 'investment' | 'debt' | 'purchase' | 'other';
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
} 