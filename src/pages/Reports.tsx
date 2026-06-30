import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Download, ChevronDown, ChevronRight, Calendar, TrendingUp, BarChart2, Layers } from 'lucide-react';
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
import { CATEGORY_ICONS, CATEGORY_COLORS } from '../constants';
import type { MonthlySummary, WeeklySummary, DailySummary } from '../types';

type ReportView = 'monthly' | 'weekly' | 'daily';

export const Reports: React.FC = () => {
  const { onMenuToggle } = useOutletContext<{ onMenuToggle: () => void }>();
  const years = useAvailableYears();
  const [selectedYear, setSelectedYear] = useState(getYear(new Date()));
  const [view, setView] = useState<ReportView>('monthly');
  // Track expanded months and weeks independently, reset when view changes
  const [expandedMonths, setExpandedMonths] = useState<Set<number>>(new Set());
  const [expandedWeeks, setExpandedWeeks] = useState<Set<string>>(new Set());

  const yearlySummary = useYearlySummary(selectedYear);
  const allExpenses = useExpenseStore((s) => s.expenses);

  const monthlyChartData = yearlySummary.monthlySummaries.map((m) => ({
    label: format(new Date(m.year, m.month, 1), 'MMM'),
    total: m.total,
  }));

  const handleViewChange = (v: ReportView) => {
    setView(v);
    // Reset expanded state when switching views so nothing appears broken
    setExpandedMonths(new Set());
    setExpandedWeeks(new Set());
  };

  const toggleMonth = (monthIdx: number) => {
    setExpandedMonths((prev) => {
      const next = new Set(prev);
      if (next.has(monthIdx)) next.delete(monthIdx);
      else next.add(monthIdx);
      return next;
    });
  };

  const toggleWeek = (weekKey: string) => {
    setExpandedWeeks((prev) => {
      const next = new Set(prev);
      if (next.has(weekKey)) next.delete(weekKey);
      else next.add(weekKey);
      return next;
    });
  };

  const handleExport = (fmt: 'csv' | 'excel' | 'pdf') => {
    const yearExpenses = allExpenses.filter((e) => getYear(new Date(e.date)) === selectedYear);
    if (!yearExpenses.length) { toast.error('No data to export'); return; }
    if (fmt === 'csv') exportToCSV(yearExpenses, `report-${selectedYear}`);
    else if (fmt === 'excel') exportToExcel(yearExpenses, `report-${selectedYear}`);
    else exportToPDF(yearExpenses, `Annual Report ${selectedYear}`);
    toast.success(`Exported as ${fmt.toUpperCase()}`);
  };

  // Only show months that have expenses
  const monthsWithData = yearlySummary.monthlySummaries.filter((m) => m.count > 0);

  const viewButtons: { key: ReportView; label: string; icon: React.ReactNode }[] = [
    { key: 'monthly', label: 'Monthly', icon: <BarChart2 className="w-3.5 h-3.5" /> },
    { key: 'weekly',  label: 'Weekly',  icon: <TrendingUp className="w-3.5 h-3.5" /> },
    { key: 'daily',   label: 'Daily',   icon: <Calendar className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Reports" subtitle="Hierarchical expense reports" onMenuToggle={onMenuToggle} />

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedYear}
            onChange={(e) => { setSelectedYear(Number(e.target.value)); setExpandedMonths(new Set()); setExpandedWeeks(new Set()); }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>

          {/* View switcher */}
          <div className="flex items-center gap-1 bg-white border border-gray-100 rounded-lg p-1 shadow-sm">
            {viewButtons.map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => handleViewChange(key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  view === key
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                }`}
              >
                {icon}{label}
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

        {/* Annual Summary KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Spending',  value: formatCurrency(yearlySummary.total),                              sub: `${yearlySummary.count} transactions` },
            { label: 'Monthly Avg',     value: formatCurrency(yearlySummary.total / 12),                         sub: 'Per month' },
            { label: 'Daily Avg',       value: formatCurrency(yearlySummary.total / 365),                        sub: 'Per day' },
            { label: 'Top Category',    value: yearlySummary.categoryBreakdown[0]?.category ?? '—',              sub: yearlySummary.categoryBreakdown[0] ? formatCurrency(yearlySummary.categoryBreakdown[0].total) : 'No data' },
          ].map((item) => (
            <Card key={item.label} padding="sm">
              <p className="text-xs text-gray-500 mb-1">{item.label}</p>
              <p className="text-lg font-bold text-gray-900 truncate">{item.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{item.sub}</p>
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

        {/* Hierarchical Report Table */}
        <Card padding="none">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                {view === 'monthly' ? 'Monthly Breakdown' : view === 'weekly' ? 'Weekly Breakdown' : 'Daily Breakdown'} — {selectedYear}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">Click any row to expand details</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">
              <Layers className="w-3.5 h-3.5" />
              {monthsWithData.length} months with data
            </div>
          </div>

          {monthsWithData.length === 0 ? (
            <div className="py-16 text-center text-gray-400 text-sm">
              No expenses recorded for {selectedYear}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {monthsWithData.map((month) => (
                <MonthRow
                  key={month.month}
                  month={month}
                  view={view}
                  expanded={expandedMonths.has(month.month)}
                  onToggle={() => toggleMonth(month.month)}
                  expandedWeeks={expandedWeeks}
                  onToggleWeek={toggleWeek}
                />
              ))}
            </div>
          )}
        </Card>

      </div>
    </div>
  );
};

/* ─── Month Row ─────────────────────────────────────────────────────────── */
const MonthRow: React.FC<{
  month: MonthlySummary;
  view: ReportView;
  expanded: boolean;
  onToggle: () => void;
  expandedWeeks: Set<string>;
  onToggleWeek: (wk: string) => void;
}> = ({ month, view, expanded, onToggle, expandedWeeks, onToggleWeek }) => {
  const weeksWithData = month.weeklySummaries.filter((w) => w.count > 0);

  return (
    <div>
      {/* Month header row */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-transform ${expanded ? 'bg-primary-100' : 'bg-gray-100'}`}>
            {expanded
              ? <ChevronDown className="w-3 h-3 text-primary-600" />
              : <ChevronRight className="w-3 h-3 text-gray-500" />}
          </div>
          <span className="font-semibold text-gray-900">{month.monthLabel}</span>
          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{month.count} transactions</span>
        </div>
        <span className="font-bold text-gray-900 text-base">{formatCurrency(month.total)}</span>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-gray-100 bg-gray-50/40">

          {/* MONTHLY VIEW — show category breakdown */}
          {view === 'monthly' && (
            <div className="px-6 py-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Category Breakdown</p>
              <div className="space-y-3">
                {month.categoryBreakdown.length === 0 ? (
                  <p className="text-sm text-gray-400">No data</p>
                ) : (
                  month.categoryBreakdown.map((cat) => (
                    <div key={cat.category} className="flex items-center gap-3">
                      <span className="text-lg w-6 text-center">{CATEGORY_ICONS[cat.category]}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">{cat.category}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-gray-400">{cat.count} txn</span>
                            <span className="text-sm font-bold text-gray-900">{formatCurrency(cat.total)}</span>
                          </div>
                        </div>
                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${cat.percentage}%`, backgroundColor: CATEGORY_COLORS[cat.category] }}
                          />
                        </div>
                      </div>
                      <span className="text-xs text-gray-400 w-8 text-right">{cat.percentage.toFixed(0)}%</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* WEEKLY VIEW — show weeks with their category breakdown */}
          {view === 'weekly' && (
            <div className="divide-y divide-gray-100">
              {weeksWithData.length === 0 ? (
                <p className="px-10 py-4 text-sm text-gray-400">No weekly data</p>
              ) : (
                weeksWithData.map((week) => (
                  <WeekRow
                    key={week.weekStart}
                    week={week}
                    view="weekly"
                    expanded={expandedWeeks.has(week.weekStart)}
                    onToggle={() => onToggleWeek(week.weekStart)}
                  />
                ))
              )}
            </div>
          )}

          {/* DAILY VIEW — show weeks → days */}
          {view === 'daily' && (
            <div className="divide-y divide-gray-100">
              {weeksWithData.length === 0 ? (
                <p className="px-10 py-4 text-sm text-gray-400">No daily data</p>
              ) : (
                weeksWithData.map((week) => (
                  <WeekRow
                    key={week.weekStart}
                    week={week}
                    view="daily"
                    expanded={expandedWeeks.has(week.weekStart)}
                    onToggle={() => onToggleWeek(week.weekStart)}
                  />
                ))
              )}
            </div>
          )}

        </div>
      )}
    </div>
  );
};

/* ─── Week Row ──────────────────────────────────────────────────────────── */
const WeekRow: React.FC<{
  week: WeeklySummary;
  view: ReportView;
  expanded: boolean;
  onToggle: () => void;
}> = ({ week, view, expanded, onToggle }) => (
  <div>
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between pl-10 pr-5 py-3 hover:bg-gray-100/70 transition-colors text-left"
    >
      <div className="flex items-center gap-3">
        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${expanded ? 'bg-primary-100' : 'bg-gray-200'}`}>
          {expanded
            ? <ChevronDown className="w-2.5 h-2.5 text-primary-600" />
            : <ChevronRight className="w-2.5 h-2.5 text-gray-500" />}
        </div>
        <span className="text-sm font-medium text-gray-700">{week.weekLabel}</span>
        <span className="text-xs text-gray-400">{week.count} transactions</span>
      </div>
      <span className="text-sm font-bold text-gray-900">{formatCurrency(week.total)}</span>
    </button>

    {expanded && (
      <div className="border-t border-gray-100 bg-white/60">

        {/* Weekly view: show category breakdown for the week */}
        {view === 'weekly' && (
          <div className="pl-14 pr-5 py-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Category Breakdown</p>
            <div className="space-y-2">
              {week.categoryBreakdown.length === 0 ? (
                <p className="text-xs text-gray-400">No data</p>
              ) : (
                week.categoryBreakdown.map((cat) => (
                  <div key={cat.category} className="flex items-center gap-2">
                    <span className="text-sm">{CATEGORY_ICONS[cat.category]}</span>
                    <span className="text-xs text-gray-700 flex-1">{cat.category}</span>
                    <span className="text-xs text-gray-400">{cat.count} txn</span>
                    <span className="text-xs font-semibold text-gray-900 w-20 text-right">{formatCurrency(cat.total)}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Daily view: show individual days */}
        {view === 'daily' && (
          <div className="divide-y divide-gray-50">
            {week.dailySummaries.length === 0 ? (
              <p className="pl-14 py-3 text-xs text-gray-400">No daily data</p>
            ) : (
              week.dailySummaries.map((day) => (
                <DayRow key={day.date} day={day} />
              ))
            )}
          </div>
        )}

      </div>
    )}
  </div>
);

/* ─── Day Row ───────────────────────────────────────────────────────────── */
const DayRow: React.FC<{ day: DailySummary }> = ({ day }) => (
  <div className="pl-14 pr-5 py-3">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <Calendar className="w-3.5 h-3.5 text-primary-400" />
        <span className="text-xs font-semibold text-gray-700">{formatDate(day.date, 'EEEE, MMM dd')}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-400">{day.count} transactions</span>
        <span className="text-xs font-bold text-gray-900">{formatCurrency(day.total)}</span>
      </div>
    </div>
    <div className="space-y-1.5">
      {day.expenses.map((e) => (
        <div key={e.id} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-gray-100">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm">{CATEGORY_ICONS[e.category]}</span>
            <span className="text-xs text-gray-700 truncate">{e.description}</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            <CategoryBadge category={e.category} />
            <span className="text-xs font-semibold text-gray-900">{formatCurrency(e.amount)}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);
