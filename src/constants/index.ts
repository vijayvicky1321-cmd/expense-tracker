import type { Category, PaymentMethod } from '../types';

export const CATEGORIES: Category[] = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Health & Medical',
  'Housing & Utilities',
  'Education',
  'Travel',
  'Personal Care',
  'Investments',
  'Gifts & Donations',
  'Other',
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  'Cash',
  'Credit Card',
  'Debit Card',
  'UPI',
  'Net Banking',
  'Wallet',
  'Cheque',
  'Other',
];

export const CATEGORY_COLORS: Record<Category, string> = {
  'Food & Dining': '#f97316',
  Transportation: '#3b82f6',
  Shopping: '#a855f7',
  Entertainment: '#ec4899',
  'Health & Medical': '#22c55e',
  'Housing & Utilities': '#06b6d4',
  Education: '#eab308',
  Travel: '#14b8a6',
  'Personal Care': '#f43f5e',
  Investments: '#6366f1',
  'Gifts & Donations': '#84cc16',
  Other: '#94a3b8',
};

export const CATEGORY_ICONS: Record<Category, string> = {
  'Food & Dining': '🍽️',
  Transportation: '🚗',
  Shopping: '🛍️',
  Entertainment: '🎬',
  'Health & Medical': '💊',
  'Housing & Utilities': '🏠',
  Education: '📚',
  Travel: '✈️',
  'Personal Care': '💆',
  Investments: '📈',
  'Gifts & Donations': '🎁',
  Other: '📦',
};

export const PAYMENT_METHOD_ICONS: Record<PaymentMethod, string> = {
  Cash: '💵',
  'Credit Card': '💳',
  'Debit Card': '💳',
  UPI: '📱',
  'Net Banking': '🏦',
  Wallet: '👛',
  Cheque: '📄',
  Other: '💰',
};

export const LOCAL_STORAGE_KEY = 'expense_tracker_data';
