import React from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { formatCurrency } from '../../utils/date';

interface DataPoint {
  label: string;
  total: number;
}

interface Props {
  data: DataPoint[];
  color?: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg p-3 text-sm">
      <p className="font-semibold text-gray-700">{label}</p>
      <p className="text-primary-600 font-semibold">{formatCurrency(payload[0].value)}</p>
    </div>
  );
};

export const TrendLineChart: React.FC<Props> = ({ data, color = '#3b82f6' }) => {
  if (!data.length) return <div className="flex items-center justify-center h-64 text-gray-400 text-sm">No data</div>;

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.15} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="total" stroke={color} strokeWidth={2.5} fill="url(#colorTotal)" dot={{ fill: color, r: 4 }} activeDot={{ r: 6 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
};
