import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Card, CardHeader } from '../components/ui/Card';
import { TrendLineChart } from '../components/charts/TrendLineChart';
import { CategoryBarChart } from '../components/charts/CategoryBarChart';
import { CategoryPieChart } from '../components/charts/CategoryPieChart';
import { useExpenseStore } from '../store/useExpenseStore';
import { useAvailableYears } from '../hooks/useExpenses';
import { buildMonthlySummaries, buildCategoryBreakdown } from '../utils/expense';
import { formatCurrency, getYear, getWeekRange, isInRange, parseISO } from '../utils/date';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import { CATEGORY_COLORS } from '../constants';

export const Analytics: React.FC = () => {
  const { onMenuToggle } = useOutletContext<{ onMenuToggle: () => void }>();
  const years = useAvailableYears();
  const [selectedYear, setSelectedYear] = useState(getYear(new Date()));
  const allExpenses = useExpenseStore((s) => s.expenses);

  // Monthly trend
  const monthlySummaries = useMemo(
    () => buildMonthlySummaries(allExpenses.filter((e) => getYear(parseISO(e.date)) === selectedYear), selectedYear),
    [allExpenses, selectedYear]
  );

  const monthlyTrendData = monthlySummaries.map((m) => ({
    label: format(new Date(m.year, m.month, 1), 'MMM'),
    total: m.total,
  }));

  // Last 30 days daily trend
  const last30Data = useMemo(() => {
    const days = eachDayOfInterval({ start: subDays(new Date(), 29), end: new Date() });
    return days.map((d) => {
      const dateStr = format(d, 'yyyy-MM-dd');
      const total = allExpenses
        .filter((e) => e.date === dateStr)
        .reduce((s, e) => s + e.amount, 0);
      return { label: format(d, 'dd MMM'), total };
    });
  }, [allExpenses]);

  // Yearly category breakdown
  const yearlyBreakdown = useMemo(
    () => buildCategoryBreakdown(allExpenses.filter((e) => getYear(parseISO(e.date)) === selectedYear)),
    [allExpenses, selectedYear]
  );

  // Weekly comparison (last 8 weeks)
  const weeklyData = useMemo(() => {
    const result: { label: string; total: number }[] = [];
    for (let i = 7; i >= 0; i--) {
      const weekDate = subDays(new Date(), i * 7);
      const { from, to } = getWeekRange(weekDate);
      const total = allExpenses.filter((e) => isInRange(e.date, from, to)).reduce((s, e) => s + e.amount, 0);
      result.push({ label: `W${8 - i}`, total });
    }
    return result;
  }, [allExpenses]);

  // Compute max/avg/min from monthly
  const monthlyTotals = monthlySummaries.map((m) => m.total).filter((t) => t > 0);
  const maxMonth = Math.max(...(monthlyTotals.length ? monthlyTotals : [0]));
  const minMonth = Math.min(...(monthlyTotals.length ? monthlyTotals : [0]));
  const avgMonth = monthlyTotals.length ? monthlyTotals.reduce((a, b) => a + b, 0) / monthlyTotals.length : 0;

  const totalYear = allExpenses.filter((e) => getYear(parseISO(e.date)) === selectedYear).reduce((s, e) => s + e.amount, 0);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Analytics" subtitle="Spending trends & insights" onMenuToggle={onMenuToggle} />

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {/* Year selector */}
        <div className="flex items-center gap-3">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          <span className="text-sm text-gray-500">Showing analytics for {selectedYear}</span>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Spent', value: formatCurrency(totalYear), color: '#3b82f6' },
            { label: 'Highest Month', value: formatCurrency(maxMonth), color: '#ef4444' },
            { label: 'Lowest Month', value: formatCurrency(minMonth), color: '#22c55e' },
            { label: 'Monthly Average', value: formatCurrency(avgMonth), color: '#f59e0b' },
          ].map((kpi) => (
            <Card key={kpi.label} padding="sm">
              <div className="w-2 h-2 rounded-full mb-2" style={{ backgroundColor: kpi.color }} />
              <p className="text-lg font-bold text-gray-900">{kpi.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{kpi.label}</p>
            </Card>
          ))}
        </div>

        {/* Last 30 days */}
        <Card>
          <CardHeader title="Daily Spending — Last 30 Days" />
          <TrendLineChart data={last30Data} />
        </Card>

        {/* Monthly trend */}
        <Card>
          <CardHeader title="Monthly Trend" subtitle={String(selectedYear)} />
          <TrendLineChart data={monthlyTrendData} color="#8b5cf6" />
        </Card>

        {/* Weekly comparison */}
        <Card>
          <CardHeader title="Weekly Comparison" subtitle="Last 8 weeks" />
          <TrendLineChart data={weeklyData} color="#f59e0b" />
        </Card>

        {/* Category breakdown side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader title="Category Distribution" subtitle={String(selectedYear)} />
            <CategoryPieChart data={yearlyBreakdown} />
          </Card>
          <Card>
            <CardHeader title="Spending by Category" subtitle={String(selectedYear)} />
            <CategoryBarChart data={yearlyBreakdown} />
          </Card>
        </div>

        {/* Category table */}
        {yearlyBreakdown.length > 0 && (
          <Card padding="none">
            <div className="p-5 border-b border-gray-50">
              <h3 className="text-base font-semibold text-gray-900">Category Breakdown — {selectedYear}</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-50">
                    {['Category', 'Transactions', 'Total', 'Share', 'Avg per txn'].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {yearlyBreakdown.map((item) => (
                    <tr key={item.category} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[item.category] }} />
                          <span className="font-medium text-gray-900">{item.category}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-gray-500">{item.count}</td>
                      <td className="px-5 py-3 font-semibold text-gray-900">{formatCurrency(item.total)}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full max-w-[80px]">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${item.percentage}%`, backgroundColor: CATEGORY_COLORS[item.category] }}
                            />
                          </div>
                          <span className="text-gray-500 text-xs">{item.percentage.toFixed(1)}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-gray-500">{formatCurrency(item.total / item.count)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
