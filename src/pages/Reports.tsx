import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Download, ChevronDown, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { Header } from '../components/layout/Header';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { CategoryBadge } from '../components/ui/Badge';
import { SpendingBarChart } from '../components/charts/SpendingBarChart';
import { CategoryPieChart } from '../components/charts/CategoryPieChart';
import { useExpenseStore } from '../store/useExpenseStore';
import { useYearlySummary, useAvailableYears } from '../hooks/useExpenses';
import { formatCurrency, formatDate, getYear } from '../utils/date';
import { exportToCSV, exportToExcel, exportToPDF } from '../services/exportService';
import { format } from 'date-fns';
import { CATEGORY_ICONS } from '../constants';
import type { MonthlySummary, WeeklySummary } from '../types';

type ReportView = 'monthly' | 'weekly' | 'daily';

export const Reports: React.FC = () => {
  const { onMenuToggle } = useOutletContext<{ onMenuToggle: () => void }>();
  const years = useAvailableYears();
  const [selectedYear, setSelectedYear] = useState(getYear(new Date()));
  const [view, setView] = useState<ReportView>('monthly');
  const [expandedMonth, setExpandedMonth] = useState<number | null>(null);
  const [expandedWeek, setExpandedWeek] = useState<string | null>(null);

  const yearlySummary = useYearlySummary(selectedYear);
  const allExpenses = useExpenseStore((s) => s.expenses);

  const monthlyChartData = yearlySummary.monthlySummaries.map((m) => ({
    label: format(new Date(m.year, m.month, 1), 'MMM'),
    total: m.total,
  }));

  const handleExport = (fmt: 'csv' | 'excel' | 'pdf') => {
    const yearExpenses = allExpenses.filter((e) => getYear(new Date(e.date)) === selectedYear);
    if (fmt === 'csv') exportToCSV(yearExpenses, `report-${selectedYear}`);
    else if (fmt === 'excel') exportToExcel(yearExpenses, `report-${selectedYear}`);
    else exportToPDF(yearExpenses, `Annual Report ${selectedYear}`);
    toast.success(`Exported as ${fmt.toUpperCase()}`);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Reports" subtitle="Hierarchical expense reports" onMenuToggle={onMenuToggle} />

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>

          <div className="flex items-center gap-1 bg-white border border-gray-100 rounded-lg p-1 shadow-sm">
            {(['monthly', 'weekly', 'daily'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors capitalize ${
                  view === v ? 'bg-primary-50 text-primary-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          <div className="ml-auto flex gap-2">
            {(['csv', 'excel', 'pdf'] as const).map((fmt) => (
              <Button key={fmt} variant="secondary" size="sm" icon={<Download className="w-3.5 h-3.5" />} onClick={() => handleExport(fmt)}>
                {fmt.toUpperCase()}
              </Button>
            ))}
          </div>
        </div>

        {/* Annual Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Spending', value: formatCurrency(yearlySummary.total), sub: `${yearlySummary.count} transactions` },
            { label: 'Monthly Avg', value: formatCurrency(yearlySummary.total / 12), sub: 'Per month' },
            { label: 'Daily Avg', value: formatCurrency(yearlySummary.total / 365), sub: 'Per day' },
            { label: 'Top Category', value: yearlySummary.categoryBreakdown[0]?.category ?? '—', sub: yearlySummary.categoryBreakdown[0] ? formatCurrency(yearlySummary.categoryBreakdown[0].total) : '' },
          ].map((item) => (
            <Card key={item.label} padding="sm">
              <p className="text-xs text-gray-500">{item.label}</p>
              <p className="text-lg font-bold text-gray-900 mt-1 truncate">{item.value}</p>
              <p className="text-xs text-gray-400">{item.sub}</p>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader title="Monthly Spending" subtitle={String(selectedYear)} />
            <SpendingBarChart data={monthlyChartData} />
          </Card>
          <Card>
            <CardHeader title="Category Distribution" subtitle={String(selectedYear)} />
            <CategoryPieChart data={yearlySummary.categoryBreakdown} />
          </Card>
        </div>

        {/* Hierarchical Report */}
        <Card padding="none">
          <div className="p-5 border-b border-gray-50">
            <h3 className="text-base font-semibold text-gray-900">Detailed Report — {selectedYear}</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {yearlySummary.monthlySummaries.filter((m) => m.total > 0 || view !== 'daily').map((month) => (
              <MonthRow
                key={month.month}
                month={month}
                view={view}
                expanded={expandedMonth === month.month}
                onToggle={() => setExpandedMonth(expandedMonth === month.month ? null : month.month)}
                expandedWeek={expandedWeek}
                onToggleWeek={(wk) => setExpandedWeek(expandedWeek === wk ? null : wk)}
              />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

const MonthRow: React.FC<{
  month: MonthlySummary;
  view: ReportView;
  expanded: boolean;
  onToggle: () => void;
  expandedWeek: string | null;
  onToggleWeek: (wk: string) => void;
}> = ({ month, view, expanded, onToggle, expandedWeek, onToggleWeek }) => (
  <div>
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center gap-3">
        {expanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
        <span className="font-semibold text-gray-900">{month.monthLabel}</span>
        <span className="text-sm text-gray-400">{month.count} transactions</span>
      </div>
      <span className="font-bold text-gray-900">{formatCurrency(month.total)}</span>
    </button>

    {expanded && (
      <div className="bg-gray-50/50 border-t border-gray-50">
        {view === 'monthly' && (
          <div className="px-8 py-4 space-y-2">
            {month.categoryBreakdown.map((cat) => (
              <div key={cat.category} className="flex items-center gap-3">
                <span className="text-base">{CATEGORY_ICONS[cat.category]}</span>
                <span className="text-sm text-gray-700 flex-1">{cat.category}</span>
                <span className="text-xs text-gray-400">{cat.count} txn</span>
                <span className="text-sm font-semibold text-gray-900">{formatCurrency(cat.total)}</span>
              </div>
            ))}
          </div>
        )}

        {(view === 'weekly' || view === 'daily') && (
          <div className="divide-y divide-gray-100">
            {month.weeklySummaries.filter((w) => w.total > 0).map((week) => (
              <WeekRow
                key={week.weekStart}
                week={week}
                view={view}
                expanded={expandedWeek === week.weekStart}
                onToggle={() => onToggleWeek(week.weekStart)}
              />
            ))}
          </div>
        )}
      </div>
    )}
  </div>
);

const WeekRow: React.FC<{
  week: WeeklySummary;
  view: ReportView;
  expanded: boolean;
  onToggle: () => void;
}> = ({ week, view, expanded, onToggle }) => (
  <div>
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between px-10 py-3 hover:bg-gray-100/50 transition-colors"
    >
      <div className="flex items-center gap-3">
        {expanded ? <ChevronDown className="w-3.5 h-3.5 text-gray-400" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
        <span className="text-sm font-medium text-gray-700">{week.weekLabel}</span>
        <span className="text-xs text-gray-400">{week.count} transactions</span>
      </div>
      <span className="text-sm font-bold text-gray-900">{formatCurrency(week.total)}</span>
    </button>

    {expanded && view === 'daily' && (
      <div className="divide-y divide-gray-100 bg-white/50">
        {week.dailySummaries.map((day) => (
          <div key={day.date} className="px-14 py-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-600">{formatDate(day.date, 'EEEE, MMM dd')}</span>
              <span className="text-xs font-bold text-gray-900">{formatCurrency(day.total)}</span>
            </div>
            {day.expenses.map((e) => (
              <div key={e.id} className="flex items-center justify-between py-1">
                <span className="text-xs text-gray-600">{e.description}</span>
                <div className="flex items-center gap-2">
                  <CategoryBadge category={e.category} />
                  <span className="text-xs font-medium text-gray-900">{formatCurrency(e.amount)}</span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    )}
  </div>
);
