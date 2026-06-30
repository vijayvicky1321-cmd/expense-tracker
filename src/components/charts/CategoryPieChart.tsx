import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
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
      <p className="text-gray-500">{formatCurrency(d.total)}</p>
      <p className="text-gray-400">{d.percentage.toFixed(1)}%</p>
    </div>
  );
};

export const CategoryPieChart: React.FC<Props> = ({ data }) => {
  if (!data.length) return <div className="flex items-center justify-center h-64 text-gray-400 text-sm">No data</div>;

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          dataKey="total"
          nameKey="category"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={110}
          paddingAngle={2}
        >
          {data.map((entry) => (
            <Cell key={entry.category} fill={CATEGORY_COLORS[entry.category]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(value) => <span className="text-xs text-gray-600">{value}</span>}
          iconSize={10}
          iconType="circle"
        />
      </PieChart>
    </ResponsiveContainer>
  );
};
