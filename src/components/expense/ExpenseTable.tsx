import React, { useState } from 'react';
import { Edit2, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import type { Expense } from '../../types';
import { formatDate, formatCurrency } from '../../utils/date';
import { CATEGORY_COLORS, CATEGORY_ICONS, PAYMENT_METHOD_ICONS } from '../../constants';
import { CategoryBadge } from '../ui/Badge';
import { EmptyState } from '../ui/EmptyState';

type SortKey = 'date' | 'amount' | 'category' | 'description';
type SortDir = 'asc' | 'desc';

interface ExpenseTableProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export const ExpenseTable: React.FC<ExpenseTableProps> = ({ expenses, onEdit, onDelete }) => {
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('desc'); }
  };

  const sorted = [...expenses].sort((a, b) => {
    let cmp = 0;
    if (sortKey === 'date') cmp = a.date.localeCompare(b.date);
    else if (sortKey === 'amount') cmp = a.amount - b.amount;
    else if (sortKey === 'category') cmp = a.category.localeCompare(b.category);
    else if (sortKey === 'description') cmp = a.description.localeCompare(b.description);
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const SortIcon = ({ col }: { col: SortKey }) =>
    sortKey === col
      ? sortDir === 'asc'
        ? <ChevronUp className="w-3.5 h-3.5" />
        : <ChevronDown className="w-3.5 h-3.5" />
      : <ChevronDown className="w-3.5 h-3.5 text-gray-300" />;

  const ThButton = ({ col, label }: { col: SortKey; label: string }) => (
    <button
      onClick={() => handleSort(col)}
      className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wide hover:text-gray-700"
    >
      {label} <SortIcon col={col} />
    </button>
  );

  if (!sorted.length) return <EmptyState />;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left px-4 py-3"><ThButton col="date" label="Date" /></th>
            <th className="text-left px-4 py-3"><ThButton col="description" label="Description" /></th>
            <th className="text-left px-4 py-3"><ThButton col="category" label="Category" /></th>
            <th className="text-left px-4 py-3 hidden sm:table-cell">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Payment</span>
            </th>
            <th className="text-right px-4 py-3"><ThButton col="amount" label="Amount" /></th>
            <th className="text-right px-4 py-3">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((expense) => (
            <tr key={expense.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors group">
              <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{formatDate(expense.date, 'MMM dd, yyyy')}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <span
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                    style={{ backgroundColor: `${CATEGORY_COLORS[expense.category]}18` }}
                  >
                    {CATEGORY_ICONS[expense.category]}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">{expense.description}</p>
                    {expense.notes && <p className="text-xs text-gray-400 truncate max-w-[200px]">{expense.notes}</p>}
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <CategoryBadge category={expense.category} />
              </td>
              <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">
                {PAYMENT_METHOD_ICONS[expense.paymentMethod]} {expense.paymentMethod}
              </td>
              <td className="px-4 py-3 text-right font-semibold text-gray-900 whitespace-nowrap">
                {formatCurrency(expense.amount)}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEdit(expense)}
                    className="p-1.5 rounded-lg hover:bg-primary-50 text-gray-400 hover:text-primary-600 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDelete(expense.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
