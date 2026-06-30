import { useMemo } from 'react';
import { useExpenseStore } from '../store/useExpenseStore';
import { filterExpenses, groupByDate, buildCategoryBreakdown, buildYearlySummary } from '../utils/expense';
import { getTodayRange, getWeekRange, getMonthRange, getYearRange, isInRange, parseISO, getYear } from '../utils/date';

export const useFilteredExpenses = () => {
  const expenses = useExpenseStore((s) => s.expenses);
  const filters = useExpenseStore((s) => s.filters);

  return useMemo(
    () =>
      filterExpenses(expenses, {
        dateFrom: filters.dateFrom || undefined,
        dateTo: filters.dateTo || undefined,
        category: filters.category || undefined,
        paymentMethod: filters.paymentMethod || undefined,
        searchQuery: filters.searchQuery || undefined,
      }),
    [expenses, filters]
  );
};

export const usePeriodExpenses = () => {
  const expenses = useExpenseStore((s) => s.expenses);

  return useMemo(() => {
    const todayRange = getTodayRange();
    const weekRange = getWeekRange();
    const monthRange = getMonthRange();
    const yearRange = getYearRange();

    const today = expenses.filter((e) => isInRange(e.date, todayRange.from, todayRange.to));
    const week = expenses.filter((e) => isInRange(e.date, weekRange.from, weekRange.to));
    const month = expenses.filter((e) => isInRange(e.date, monthRange.from, monthRange.to));
    const year = expenses.filter((e) => isInRange(e.date, yearRange.from, yearRange.to));

    const sum = (arr: typeof expenses) => arr.reduce((s, e) => s + e.amount, 0);

    return {
      today: { expenses: today, total: sum(today), count: today.length },
      week: { expenses: week, total: sum(week), count: week.length },
      month: { expenses: month, total: sum(month), count: month.length },
      year: { expenses: year, total: sum(year), count: year.length },
    };
  }, [expenses]);
};

export const useDailyGroups = (expenses: ReturnType<typeof useExpenseStore.getState>['expenses']) =>
  useMemo(() => groupByDate(expenses), [expenses]);

export const useCategoryBreakdown = (expenses: ReturnType<typeof useExpenseStore.getState>['expenses']) =>
  useMemo(() => buildCategoryBreakdown(expenses), [expenses]);

export const useYearlySummary = (year: number) => {
  const expenses = useExpenseStore((s) => s.expenses);
  return useMemo(() => buildYearlySummary(expenses, year), [expenses, year]);
};

export const useAvailableYears = () => {
  const expenses = useExpenseStore((s) => s.expenses);
  return useMemo(() => {
    const years = new Set(expenses.map((e) => getYear(parseISO(e.date))));
    const currentYear = getYear(new Date());
    years.add(currentYear);
    return Array.from(years).sort((a, b) => b - a);
  }, [expenses]);
};
