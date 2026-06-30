import { create } from 'zustand';
import type { Expense, ExpenseFormData, FilterState } from '../types';
import { generateId } from '../utils/expense';
import { userExpenseKey } from '../utils/auth';
import { useAuthStore } from './useAuthStore';

interface ExpenseState {
  expenses: Expense[];
  filters: FilterState;

  loadForUser: (userId: string) => void;
  addExpense: (data: ExpenseFormData) => void;
  updateExpense: (id: string, data: ExpenseFormData) => void;
  deleteExpense: (id: string) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;
  importExpenses: (expenses: Expense[]) => void;
}

const defaultFilters: FilterState = {
  dateFrom: '',
  dateTo: '',
  category: '',
  paymentMethod: '',
  searchQuery: '',
};

const loadExpenses = (userId: string): Expense[] => {
  try {
    return JSON.parse(localStorage.getItem(userExpenseKey(userId)) ?? '[]');
  } catch {
    return [];
  }
};

const saveExpenses = (userId: string, expenses: Expense[]) => {
  localStorage.setItem(userExpenseKey(userId), JSON.stringify(expenses));
};

const getCurrentUserId = (): string | null =>
  useAuthStore.getState().user?.id ?? null;

export const useExpenseStore = create<ExpenseState>()((set, get) => ({
  expenses: [],
  filters: defaultFilters,

  loadForUser: (userId) => {
    set({ expenses: loadExpenses(userId), filters: defaultFilters });
  },

  addExpense: (data) => {
    const userId = getCurrentUserId();
    if (!userId) return;
    const now = new Date().toISOString();
    const expense: Expense = { ...data, id: generateId(), createdAt: now, updatedAt: now };
    const next = [expense, ...get().expenses];
    saveExpenses(userId, next);
    set({ expenses: next });
  },

  updateExpense: (id, data) => {
    const userId = getCurrentUserId();
    if (!userId) return;
    const next = get().expenses.map((e) =>
      e.id === id ? { ...e, ...data, updatedAt: new Date().toISOString() } : e
    );
    saveExpenses(userId, next);
    set({ expenses: next });
  },

  deleteExpense: (id) => {
    const userId = getCurrentUserId();
    if (!userId) return;
    const next = get().expenses.filter((e) => e.id !== id);
    saveExpenses(userId, next);
    set({ expenses: next });
  },

  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),

  resetFilters: () => set({ filters: defaultFilters }),

  importExpenses: (expenses) => {
    const userId = getCurrentUserId();
    if (!userId) return;
    saveExpenses(userId, expenses);
    set({ expenses });
  },
}));
