import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  startOfDay,
  endOfDay,
  parseISO,
  isWithinInterval,
  getWeek,
  getYear,
  getMonth,
  eachWeekOfInterval,
  eachMonthOfInterval,
} from 'date-fns';

export const formatDate = (date: string | Date, fmt = 'MMM dd, yyyy') =>
  format(typeof date === 'string' ? parseISO(date) : date, fmt);

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

export const todayISO = () => format(new Date(), 'yyyy-MM-dd');

export const getTodayRange = () => ({
  from: startOfDay(new Date()),
  to: endOfDay(new Date()),
});

export const getWeekRange = (date = new Date()) => ({
  from: startOfWeek(date, { weekStartsOn: 1 }),
  to: endOfWeek(date, { weekStartsOn: 1 }),
});

export const getMonthRange = (date = new Date()) => ({
  from: startOfMonth(date),
  to: endOfMonth(date),
});

export const getYearRange = (date = new Date()) => ({
  from: startOfYear(date),
  to: endOfYear(date),
});

export const isInRange = (dateStr: string, from: Date, to: Date) =>
  isWithinInterval(parseISO(dateStr), { start: from, end: to });

export const getWeekLabel = (date: Date) => {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(date, { weekStartsOn: 1 });
  return `${format(start, 'MMM dd')} – ${format(end, 'MMM dd, yyyy')}`;
};

export const getMonthLabel = (date: Date) => format(date, 'MMMM yyyy');

export const getWeekNumber = (date: Date) => getWeek(date, { weekStartsOn: 1 });

export {
  parseISO,
  getYear,
  getMonth,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  eachWeekOfInterval,
  eachMonthOfInterval,
  format,
};
