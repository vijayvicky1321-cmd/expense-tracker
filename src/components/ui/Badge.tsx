import React from 'react';
import { CATEGORY_COLORS } from '../../constants';
import type { Category } from '../../types';

interface BadgeProps {
  label: string;
  color?: string;
  variant?: 'solid' | 'soft';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ label, color = '#6366f1', variant = 'soft', className = '' }) => {
  const style =
    variant === 'soft'
      ? { backgroundColor: `${color}18`, color, borderColor: `${color}30` }
      : { backgroundColor: color, color: '#fff' };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${className}`}
      style={style}
    >
      {label}
    </span>
  );
};

export const CategoryBadge: React.FC<{ category: Category }> = ({ category }) => (
  <Badge label={category} color={CATEGORY_COLORS[category]} />
);
