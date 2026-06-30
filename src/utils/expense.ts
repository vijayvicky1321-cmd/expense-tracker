import { parseISO, format, endOfWeek, startOfMonth, endOfMonth, getYear, getMonth, eachWeekOfInterval, eachMonthOfInterval, eachDayOfInterval } from 'date-fns';
import type { Expense, DailySummary, WeeklySummary, MonthlySummary, YearlySummary, CategoryBreakdown, Category } from '../types';
import { getWeekLabel, getMonthLabel, isInRange } from './date';
import { CATEGORIES } from '../constants';

export const groupByDate = (expenses: Expense[]): DailySummary[] => {
  const map = new Map<string, Expense[]>();
  for (const e of expenses) {
    const list = map.get(e.date) ?? [];
    list.push(e);
    map.set(e.date, list);
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([date, exps]) => ({
      date,
      total: exps.reduce((s, e) => s + e.amount, 0),
      count: exps.length,
      expenses: exps.sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    }));
};

export const buildCategoryBreakdown = (expenses: Expense[]): CategoryBreakdown[] => {
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const map = new Map<Category, { total: number; count: number }>();
  for (const e of expenses) {
    const cur = map.get(e.category) ?? { total: 0, count: 0 };
    map.set(e.category, { total: cur.total + e.amount, count: cur.count + 1 });
  }
  return CATEGORIES.filter((c) => map.has(c))
    .map((c) => ({
      category: c,
      total: map.get(c)!.total,
      count: map.get(c)!.count,
      percentage: total > 0 ? (map.get(c)!.total / total) * 100 : 0,
    }))
    .sort((a, b) => b.total - a.total);
};

export const buildWeeklySummaries = (expenses: Expense[], year: number, month: number): WeeklySummary[] => {
  const monthStart = startOfMonth(new Date(year, month));
  const monthEnd = endOfMonth(monthStart);
  const weekStarts = eachWeekOfInterval({ start: monthStart, end: monthEnd }, { weekStartsOn: 1 });

  return weekStarts.map((ws) => {
    const we = endOfWeek(ws, { weekStartsOn: 1 });
    // Clamp week boundaries to the month so expenses aren't double-counted across months
    const clampedStart = ws < monthStart ? monthStart : ws;
    const clampedEnd = we > monthEnd ? monthEnd : we;

    const weekExpenses = expenses.filter((e) => isInRange(e.date, clampedStart, clampedEnd));

    // Build daily summaries for every day in the clamped week range
    const days = eachDayOfInterval({ start: clampedStart, end: clampedEnd });
    const dailySummaries: DailySummary[] = days
      .map((day) => {
        const dateStr = format(day, 'yyyy-MM-dd');
        const dayExpenses = weekExpenses.filter((e) => e.date === dateStr);
        return {
          date: dateStr,
          total: dayExpenses.reduce((s, e) => s + e.amount, 0),
          count: dayExpenses.length,
          expenses: dayExpenses.sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
        };
      })
      .filter((d) => d.count > 0); // only days with expenses

    return {
      weekStart: format(clampedStart, 'yyyy-MM-dd'),
      weekEnd: format(clampedEnd, 'yyyy-MM-dd'),
      weekLabel: getWeekLabel(ws),
      total: weekExpenses.reduce((s, e) => s + e.amount, 0),
      count: weekExpenses.length,
      dailySummaries,
      categoryBreakdown: buildCategoryBreakdown(weekExpenses),
    };
  });
};

export const buildMonthlySummaries = (expenses: Expense[], year: number): MonthlySummary[] => {
  const yearStart = new Date(year, 0, 1);
  const yearEnd = new Date(year, 11, 31);
  const monthStarts = eachMonthOfInterval({ start: yearStart, end: yearEnd });

  return monthStarts.map((ms) => {
    const me = endOfMonth(ms);
    const month = getMonth(ms);
    // Filter by date string prefix for accuracy
    const monthExpenses = expenses.filter((e) => isInRange(e.date, ms, me));
    return {
      year,
      month,
      monthLabel: getMonthLabel(ms),
      total: monthExpenses.reduce((s, e) => s + e.amount, 0),
      count: monthExpenses.length,
      weeklySummaries: buildWeeklySummaries(monthExpenses, year, month),
      categoryBreakdown: buildCategoryBreakdown(monthExpenses),
    };
  });
};

export const buildYearlySummary = (expenses: Expense[], year: number): YearlySummary => {
  const yearExpenses = expenses.filter((e) => getYear(parseISO(e.date)) === year);
  return {
    year,
    total: yearExpenses.reduce((s, e) => s + e.amount, 0),
    count: yearExpenses.length,
    monthlySummaries: buildMonthlySummaries(yearExpenses, year),
    categoryBreakdown: buildCategoryBreakdown(yearExpenses),
  };
};

export const filterExpenses = (
  expenses: Expense[],
  opts: {
    dateFrom?: string;
    dateTo?: string;
    category?: string;
    paymentMethod?: string;
    searchQuery?: string;
  }
): Expense[] => {
  return expenses.filter((e) => {
    if (opts.dateFrom && e.date < opts.dateFrom) return false;
    if (opts.dateTo && e.date > opts.dateTo) return false;
    if (opts.category && e.category !== opts.category) return false;
    if (opts.paymentMethod && e.paymentMethod !== opts.paymentMethod) return false;
    if (opts.searchQuery) {
      const q = opts.searchQuery.toLowerCase();
      if (
        !e.description.toLowerCase().includes(q) &&
        !e.category.toLowerCase().includes(q) &&
        !(e.notes ?? '').toLowerCase().includes(q)
      )
        return false;
    }
    return true;
  });
};

export const generateId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
