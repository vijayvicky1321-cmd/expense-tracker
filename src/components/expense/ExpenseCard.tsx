import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import type { Expense } from '../../types';
import { formatDate, formatCurrency } from '../../utils/date';
import { CATEGORY_COLORS, CATEGORY_ICONS, PAYMENT_METHOD_ICONS } from '../../constants';
import { CategoryBadge } from '../ui/Badge';

interface ExpenseCardProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export const ExpenseCard: React.FC<ExpenseCardProps> = ({ expense, onEdit, onDelete }) => (
  <div className="flex items-center gap-3 p-4 hover:bg-gray-50 rounded-xl transition-colors group">
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
      style={{ backgroundColor: `${CATEGORY_COLORS[expense.category]}18` }}
    >
      {CATEGORY_ICONS[expense.category]}
    </div>

    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 flex-wrap">
        <p className="text-sm font-medium text-gray-900 truncate">{expense.description}</p>
        <CategoryBadge category={expense.category} />
      </div>
      <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-400">
        <span>{formatDate(expense.date)}</span>
        <span>·</span>
        <span>{PAYMENT_METHOD_ICONS[expense.paymentMethod]} {expense.paymentMethod}</span>
        {expense.notes && (
          <>
            <span>·</span>
            <span className="truncate max-w-[150px]">{expense.notes}</span>
          </>
        )}
      </div>
    </div>

    <div className="flex items-center gap-2">
      <span className="text-base font-semibold text-gray-900">{formatCurrency(expense.amount)}</span>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
    </div>
  </div>
);
