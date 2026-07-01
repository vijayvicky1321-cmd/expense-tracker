import { create } from 'zustand';
import { db } from '../lib/firebase';
import type { Expense, ExpenseFormData, FilterState } from '../types';
import { generateId } from '../utils/expense';

interface ExpenseState {
  expenses: Expense[];
  filters: FilterState;
  loadingExpenses: boolean;

  loadForUser: (userId: string) => Promise<void>;
  addExpense: (data: ExpenseFormData, userId: string) => Promise<void>;
  updateExpense: (id: string, data: ExpenseFormData, userId: string) => Promise<void>;
  deleteExpense: (id: string, userId: string) => Promise<void>;
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;
  clearExpenses: () => void;
}

const defaultFilters: FilterState = {
  dateFrom: '',
  dateTo: '',
  category: '',
  paymentMethod: '',
  searchQuery: '',
};

const userCollection = (userId: string) =>
  db.collection('users').doc(userId).collection('expenses');

export const useExpenseStore = create<ExpenseState>()((set, get) => ({
  expenses: [],
  filters: defaultFilters,
  loadingExpenses: false,

  loadForUser: async (userId) => {
    set({ loadingExpenses: true, expenses: [] });
    try {
      const snapshot = await userCollection(userId)
        .orderBy('date', 'desc')
        .get();
      const expenses: Expense[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Expense, 'id'>),
      }));
      set({ expenses, loadingExpenses: false });
    } catch (err) {
      console.error('Failed to load expenses:', err);
      set({ loadingExpenses: false });
    }
  },

  addExpense: async (data, userId) => {
    const now = new Date().toISOString();
    const id = generateId();
    const expense: Expense = { ...data, id, createdAt: now, updatedAt: now };
    // Optimistic update
    set((s) => ({ expenses: [expense, ...s.expenses] }));
    try {
      await userCollection(userId).doc(id).set({
        date: data.date,
        amount: data.amount,
        category: data.category,
        paymentMethod: data.paymentMethod,
        description: data.description,
        notes: data.notes ?? '',
        createdAt: now,
        updatedAt: now,
      });
    } catch (err) {
      // Rollback on failure
      set((s) => ({ expenses: s.expenses.filter((e) => e.id !== id) }));
      throw err;
    }
  },

  updateExpense: async (id, data, userId) => {
    const now = new Date().toISOString();
    const prev = get().expenses;
    // Optimistic update
    set((s) => ({
      expenses: s.expenses.map((e) =>
        e.id === id ? { ...e, ...data, updatedAt: now } : e
      ),
    }));
    try {
      await userCollection(userId).doc(id).update({
        ...data,
        notes: data.notes ?? '',
        updatedAt: now,
      });
    } catch (err) {
      set({ expenses: prev });
      throw err;
    }
  },

  deleteExpense: async (id, userId) => {
    const prev = get().expenses;
    // Optimistic update
    set((s) => ({ expenses: s.expenses.filter((e) => e.id !== id) }));
    try {
      await userCollection(userId).doc(id).delete();
    } catch (err) {
      set({ expenses: prev });
      throw err;
    }
  },

  setFilters: (filters) =>
    set((s) => ({ filters: { ...s.filters, ...filters } })),

  resetFilters: () => set({ filters: defaultFilters }),

  clearExpenses: () => set({ expenses: [], filters: defaultFilters }),
}));
