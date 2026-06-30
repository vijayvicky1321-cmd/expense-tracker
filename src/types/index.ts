export type Category =
  | 'Food & Dining'
  | 'Transportation'
  | 'Shopping'
  | 'Entertainment'
  | 'Health & Medical'
  | 'Housing & Utilities'
  | 'Education'
  | 'Travel'
  | 'Personal Care'
  | 'Investments'
  | 'Gifts & Donations'
  | 'Other';

export type PaymentMethod =
  | 'Cash'
  | 'Credit Card'
  | 'Debit Card'
  | 'UPI'
  | 'Net Banking'
  | 'Wallet'
  | 'Cheque'
  | 'Other';

export interface Expense {
  id: string;
  date: string; // ISO date string YYYY-MM-DD
  amount: number;
  category: Category;
  paymentMethod: PaymentMethod;
  description: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseFormData {
  date: string;
  amount: number;
  category: Category;
  paymentMethod: PaymentMethod;
  description: string;
  notes?: string;
}

export interface DailySummary {
  date: string;
  total: number;
  count: number;
  expenses: Expense[];
}

export interface WeeklySummary {
  weekStart: string;
  weekEnd: string;
  weekLabel: string;
  total: number;
  count: number;
  dailySummaries: DailySummary[];
  categoryBreakdown: CategoryBreakdown[];
}

export interface MonthlySummary {
  year: number;
  month: number;
  monthLabel: string;
  total: number;
  count: number;
  weeklySummaries: WeeklySummary[];
  categoryBreakdown: CategoryBreakdown[];
}

export interface YearlySummary {
  year: number;
  total: number;
  count: number;
  monthlySummaries: MonthlySummary[];
  categoryBreakdown: CategoryBreakdown[];
}

export interface CategoryBreakdown {
  category: Category;
  total: number;
  count: number;
  percentage: number;
}

export interface FilterState {
  dateFrom: string;
  dateTo: string;
  category: Category | '';
  paymentMethod: PaymentMethod | '';
  searchQuery: string;
}

export type TimePeriod = 'today' | 'week' | 'month' | 'year' | 'custom';
export type ReportView = 'daily' | 'weekly' | 'monthly' | 'yearly';
export type ExportFormat = 'pdf' | 'excel' | 'csv';
