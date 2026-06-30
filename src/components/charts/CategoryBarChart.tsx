import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { CategoryBreakdown } from '../../types';
import { CATEGORY_COLORS } from '../../constants';
import { formatCurrency } from '../../utils/date';

interface Props {
  data: CategoryBreakdown[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg p-3 text-sm">
      <p className="font-semibold text-gray-900">{d.category}</p>
      <p className="text-gray-600">{formatCurrency(d.total)}</p>
      <p className="text-gray-400">{d.count} expenses · {d.percentage.toFixed(1)}%</p>
    </div>
  );
};

export const CategoryBarChart: React.FC<Props> = ({ data }) => {
  if (!data.length) return <div className="flex items-center justify-center h-64 text-gray-400 text-sm">No data</div>;

  const shortened = data.map((d) => ({
    ...d,
    label: d.category.split(' ')[0],
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={shortened} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
        <Bar dataKey="total" radius={[6, 6, 0, 0]} maxBarSize={40}>
          {shortened.map((entry) => (
            <Cell key={entry.category} fill={CATEGORY_COLORS[entry.category]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
