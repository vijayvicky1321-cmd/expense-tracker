import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Expense, ExpenseFormData, FilterState } from '../types';
import { generateId } from '../utils/expense';
import { LOCAL_STORAGE_KEY } from '../constants';

interface ExpenseState {
  expenses: Expense[];
  filters: FilterState;

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

export const useExpenseStore = create<ExpenseState>()(
  persist(
    (set) => ({
      expenses: [],
      filters: defaultFilters,

      addExpense: (data) => {
        const now = new Date().toISOString();
        const expense: Expense = {
          ...data,
          id: generateId(),
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ expenses: [expense, ...state.expenses] }));
      },

      updateExpense: (id, data) => {
        set((state) => ({
          expenses: state.expenses.map((e) =>
            e.id === id ? { ...e, ...data, updatedAt: new Date().toISOString() } : e
          ),
        }));
      },

      deleteExpense: (id) => {
        set((state) => ({ expenses: state.expenses.filter((e) => e.id !== id) }));
      },

      setFilters: (filters) => {
        set((state) => ({ filters: { ...state.filters, ...filters } }));
      },

      resetFilters: () => set({ filters: defaultFilters }),

      importExpenses: (expenses) => set({ expenses }),
    }),
    {
      name: LOCAL_STORAGE_KEY,
    }
  )
);
