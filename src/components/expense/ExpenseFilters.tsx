import React from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { CATEGORIES, PAYMENT_METHODS } from '../../constants';
import { useExpenseStore } from '../../store/useExpenseStore';

export const ExpenseFilters: React.FC = () => {
  const filters = useExpenseStore((s) => s.filters);
  const setFilters = useExpenseStore((s) => s.setFilters);
  const resetFilters = useExpenseStore((s) => s.resetFilters);

  const hasActiveFilters = Object.values(filters).some(Boolean);

  const categoryOptions = [{ value: '', label: 'All Categories' }, ...CATEGORIES.map((c) => ({ value: c, label: c }))];
  const paymentOptions = [
    { value: '', label: 'All Methods' },
    ...PAYMENT_METHODS.map((p) => ({ value: p, label: p })),
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <SlidersHorizontal className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Filters</span>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="ml-auto flex items-center gap-1 text-xs text-red-500 hover:text-red-700"
          >
            <X className="w-3.5 h-3.5" /> Clear all
          </button>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search expenses..."
          value={filters.searchQuery}
          onChange={(e) => setFilters({ searchQuery: e.target.value })}
          className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <input
          type="date"
          value={filters.dateFrom}
          onChange={(e) => setFilters({ dateFrom: e.target.value })}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="From date"
        />
        <input
          type="date"
          value={filters.dateTo}
          onChange={(e) => setFilters({ dateTo: e.target.value })}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="To date"
        />
        <select
          value={filters.category}
          onChange={(e) => setFilters({ category: e.target.value as any })}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {categoryOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <select
          value={filters.paymentMethod}
          onChange={(e) => setFilters({ paymentMethod: e.target.value as any })}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {paymentOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
