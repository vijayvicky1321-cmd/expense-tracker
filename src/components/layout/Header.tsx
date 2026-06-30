import React from 'react';
import { Menu, Plus } from 'lucide-react';
import { Button } from '../ui/Button';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onMenuToggle: () => void;
  onAddExpense?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, onMenuToggle, onAddExpense }) => (
  <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4 flex items-center gap-4 sticky top-0 z-30">
    <button
      onClick={onMenuToggle}
      className="lg:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors"
    >
      <Menu className="w-5 h-5" />
    </button>

    <div className="flex-1">
      <h1 className="text-lg font-bold text-gray-900">{title}</h1>
      {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
    </div>

    <div className="flex items-center gap-2">
      {onAddExpense && (
        <Button onClick={onAddExpense} size="sm" icon={<Plus className="w-4 h-4" />}>
          Add Expense
        </Button>
      )}
    </div>
  </header>
);
