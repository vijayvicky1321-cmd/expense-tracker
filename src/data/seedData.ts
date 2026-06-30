import type { Expense } from '../types';
import { format, subDays } from 'date-fns';

const d = (daysAgo: number) => format(subDays(new Date(), daysAgo), 'yyyy-MM-dd');

let idCounter = 1;
const makeId = () => `seed-${idCounter++}`;
const now = new Date().toISOString();

export const seedExpenses: Expense[] = [
  // Today
  { id: makeId(), date: d(0), amount: 450, category: 'Food & Dining', paymentMethod: 'UPI', description: 'Lunch at restaurant', notes: 'Team lunch', createdAt: now, updatedAt: now },
  { id: makeId(), date: d(0), amount: 150, category: 'Transportation', paymentMethod: 'Cash', description: 'Auto rickshaw', notes: '', createdAt: now, updatedAt: now },

  // Last 3 days
  { id: makeId(), date: d(1), amount: 2500, category: 'Shopping', paymentMethod: 'Credit Card', description: 'Grocery shopping', notes: 'Monthly groceries', createdAt: now, updatedAt: now },
  { id: makeId(), date: d(1), amount: 800, category: 'Entertainment', paymentMethod: 'Debit Card', description: 'Movie tickets', notes: 'Weekend movie', createdAt: now, updatedAt: now },
  { id: makeId(), date: d(2), amount: 350, category: 'Food & Dining', paymentMethod: 'UPI', description: 'Dinner with family', notes: '', createdAt: now, updatedAt: now },
  { id: makeId(), date: d(2), amount: 1200, category: 'Health & Medical', paymentMethod: 'Cash', description: 'Doctor consultation', notes: 'General checkup', createdAt: now, updatedAt: now },
  { id: makeId(), date: d(3), amount: 500, category: 'Personal Care', paymentMethod: 'Cash', description: 'Haircut & grooming', notes: '', createdAt: now, updatedAt: now },
  { id: makeId(), date: d(3), amount: 200, category: 'Transportation', paymentMethod: 'UPI', description: 'Cab to office', notes: '', createdAt: now, updatedAt: now },

  // This week
  { id: makeId(), date: d(4), amount: 5000, category: 'Housing & Utilities', paymentMethod: 'Net Banking', description: 'Electricity bill', notes: 'Monthly bill', createdAt: now, updatedAt: now },
  { id: makeId(), date: d(4), amount: 600, category: 'Food & Dining', paymentMethod: 'UPI', description: 'Breakfast and snacks', notes: '', createdAt: now, updatedAt: now },
  { id: makeId(), date: d(5), amount: 1500, category: 'Education', paymentMethod: 'Net Banking', description: 'Online course', notes: 'React course', createdAt: now, updatedAt: now },
  { id: makeId(), date: d(5), amount: 300, category: 'Transportation', paymentMethod: 'Cash', description: 'Bus pass', notes: 'Weekly bus pass', createdAt: now, updatedAt: now },
  { id: makeId(), date: d(6), amount: 750, category: 'Shopping', paymentMethod: 'Credit Card', description: 'Clothes shopping', notes: '', createdAt: now, updatedAt: now },

  // Last 2 weeks
  { id: makeId(), date: d(8), amount: 3200, category: 'Shopping', paymentMethod: 'Credit Card', description: 'Electronics accessories', notes: 'Keyboard and mouse', createdAt: now, updatedAt: now },
  { id: makeId(), date: d(9), amount: 450, category: 'Food & Dining', paymentMethod: 'UPI', description: 'Pizza delivery', notes: '', createdAt: now, updatedAt: now },
  { id: makeId(), date: d(10), amount: 900, category: 'Health & Medical', paymentMethod: 'Cash', description: 'Pharmacy medicines', notes: '', createdAt: now, updatedAt: now },
  { id: makeId(), date: d(11), amount: 12000, category: 'Housing & Utilities', paymentMethod: 'Net Banking', description: 'Monthly rent', notes: 'June rent', createdAt: now, updatedAt: now },
  { id: makeId(), date: d(12), amount: 600, category: 'Entertainment', paymentMethod: 'Debit Card', description: 'Netflix subscription', notes: 'Annual plan', createdAt: now, updatedAt: now },
  { id: makeId(), date: d(13), amount: 250, category: 'Personal Care', paymentMethod: 'Cash', description: 'Skincare products', notes: '', createdAt: now, updatedAt: now },

  // 3-4 weeks ago
  { id: makeId(), date: d(16), amount: 4500, category: 'Travel', paymentMethod: 'Credit Card', description: 'Train tickets', notes: 'Bangalore to Mumbai', createdAt: now, updatedAt: now },
  { id: makeId(), date: d(17), amount: 2200, category: 'Food & Dining', paymentMethod: 'Cash', description: 'Hotel dining', notes: '', createdAt: now, updatedAt: now },
  { id: makeId(), date: d(18), amount: 800, category: 'Transportation', paymentMethod: 'Cash', description: 'Local transport', notes: '', createdAt: now, updatedAt: now },
  { id: makeId(), date: d(19), amount: 1500, category: 'Shopping', paymentMethod: 'Credit Card', description: 'Gift shopping', notes: 'Birthday gifts', createdAt: now, updatedAt: now },
  { id: makeId(), date: d(20), amount: 5000, category: 'Investments', paymentMethod: 'Net Banking', description: 'Mutual fund SIP', notes: 'Monthly SIP', createdAt: now, updatedAt: now },

  // Last month
  { id: makeId(), date: d(32), amount: 12000, category: 'Housing & Utilities', paymentMethod: 'Net Banking', description: 'Monthly rent', notes: 'May rent', createdAt: now, updatedAt: now },
  { id: makeId(), date: d(33), amount: 3800, category: 'Shopping', paymentMethod: 'Credit Card', description: 'Monthly groceries', notes: '', createdAt: now, updatedAt: now },
  { id: makeId(), date: d(35), amount: 1200, category: 'Entertainment', paymentMethod: 'Debit Card', description: 'Spotify & OTT', notes: '', createdAt: now, updatedAt: now },
  { id: makeId(), date: d(36), amount: 600, category: 'Food & Dining', paymentMethod: 'UPI', description: 'Lunch outing', notes: '', createdAt: now, updatedAt: now },
  { id: makeId(), date: d(38), amount: 2500, category: 'Health & Medical', paymentMethod: 'Credit Card', description: 'Gym membership', notes: 'Annual membership', createdAt: now, updatedAt: now },
  { id: makeId(), date: d(40), amount: 5000, category: 'Investments', paymentMethod: 'Net Banking', description: 'Mutual fund SIP', notes: 'May SIP', createdAt: now, updatedAt: now },
  { id: makeId(), date: d(42), amount: 800, category: 'Gifts & Donations', paymentMethod: 'UPI', description: 'Charity donation', notes: '', createdAt: now, updatedAt: now },
  { id: makeId(), date: d(45), amount: 3500, category: 'Travel', paymentMethod: 'Credit Card', description: 'Weekend trip expenses', notes: 'Goa trip', createdAt: now, updatedAt: now },
  { id: makeId(), date: d(48), amount: 400, category: 'Personal Care', paymentMethod: 'Cash', description: 'Salon visit', notes: '', createdAt: now, updatedAt: now },
  { id: makeId(), date: d(50), amount: 1000, category: 'Education', paymentMethod: 'Net Banking', description: 'Book purchases', notes: 'Technical books', createdAt: now, updatedAt: now },

  // 2 months ago
  { id: makeId(), date: d(62), amount: 12000, category: 'Housing & Utilities', paymentMethod: 'Net Banking', description: 'Monthly rent', notes: 'April rent', createdAt: now, updatedAt: now },
  { id: makeId(), date: d(64), amount: 4200, category: 'Shopping', paymentMethod: 'Credit Card', description: 'Monthly groceries', notes: '', createdAt: now, updatedAt: now },
  { id: makeId(), date: d(66), amount: 900, category: 'Food & Dining', paymentMethod: 'UPI', description: 'Restaurant dinner', notes: '', createdAt: now, updatedAt: now },
  { id: makeId(), date: d(68), amount: 5000, category: 'Investments', paymentMethod: 'Net Banking', description: 'Mutual fund SIP', notes: 'April SIP', createdAt: now, updatedAt: now },
  { id: makeId(), date: d(70), amount: 2800, category: 'Shopping', paymentMethod: 'Credit Card', description: 'Footwear shopping', notes: '', createdAt: now, updatedAt: now },
  { id: makeId(), date: d(72), amount: 600, category: 'Transportation', paymentMethod: 'Cash', description: 'Fuel expenses', notes: '', createdAt: now, updatedAt: now },

  // 3 months ago
  { id: makeId(), date: d(93), amount: 12000, category: 'Housing & Utilities', paymentMethod: 'Net Banking', description: 'Monthly rent', notes: 'March rent', createdAt: now, updatedAt: now },
  { id: makeId(), date: d(95), amount: 3600, category: 'Shopping', paymentMethod: 'Credit Card', description: 'Monthly groceries', notes: '', createdAt: now, updatedAt: now },
  { id: makeId(), date: d(97), amount: 8000, category: 'Travel', paymentMethod: 'Credit Card', description: 'Flight tickets', notes: 'Delhi trip', createdAt: now, updatedAt: now },
  { id: makeId(), date: d(100), amount: 5000, category: 'Investments', paymentMethod: 'Net Banking', description: 'Mutual fund SIP', notes: 'March SIP', createdAt: now, updatedAt: now },
  { id: makeId(), date: d(102), amount: 1500, category: 'Health & Medical', paymentMethod: 'Cash', description: 'Medical tests', notes: '', createdAt: now, updatedAt: now },
  { id: makeId(), date: d(104), amount: 700, category: 'Entertainment', paymentMethod: 'Debit Card', description: 'Concert tickets', notes: '', createdAt: now, updatedAt: now },
];
