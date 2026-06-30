import React from 'react';
import { Receipt } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No expenses found',
  description = 'Add your first expense to get started.',
  action,
  icon,
}) => (
  <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
      {icon ?? <Receipt className="w-8 h-8" />}
    </div>
    <div>
      <p className="text-base font-medium text-gray-700">{title}</p>
      <p className="text-sm text-gray-400 mt-1">{description}</p>
    </div>
    {action}
  </div>
);
