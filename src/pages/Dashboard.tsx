import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Calendar, CreditCard, ShoppingBag, Activity } from 'lucide-react';
import toast from 'react-hot-toast';
import { Header } from '../components/layout/Header';
import { Card, CardHeader } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { ExpenseForm } from '../components/expense/ExpenseForm';
import { ExpenseCard } from '../components/expense/ExpenseCard';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { CategoryPieChart } from '../components/charts/CategoryPieChart';
import { SpendingBarChart } from '../components/charts/SpendingBarChart';
import { useExpenseStore } from '../store/useExpenseStore';
import { useAuthStore } from '../store/useAuthStore';
import { usePeriodExpenses, useCategoryBreakdown, useYearlySummary } from '../hooks/useExpenses';
import { formatCurrency, formatDate } from '../utils/date';
import type { Expense, ExpenseFormData } from '../types';
import { format } from 'date-fns';

interface SummaryCardProps {
  title: string;
  value: string;
  count: number;
  icon: React.ReactNode;
  color: string;
  trend?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, count, icon, color, trend }) => (
  <div className={`bg-white rounded-xl border border-gray-100 p-5 shadow-sm`}>
    <div className="flex items-center justify-between mb-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center`} style={{ backgroundColor: `${color}18` }}>
        <span style={{ color }}>{icon}</span>
      </div>
      {trend && <span className="text-xs text-gray-400 font-medium">{trend}</span>}
    </div>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
    <p className="text-xs text-gray-500 mt-1">{title}</p>
    <p className="text-xs text-gray-400 mt-0.5">{count} transactions</p>
  </div>
);

export const Dashboard: React.FC = () => {
  const { onMenuToggle } = useOutletContext<{ onMenuToggle: () => void }>();
  const [addOpen, setAddOpen] = useState(false);
  const [editExpense, setEditExpense] = useState<Expense | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const addExpense    = useExpenseStore((s) => s.addExpense);
  const updateExpense = useExpenseStore((s) => s.updateExpense);
  const deleteExpense = useExpenseStore((s) => s.deleteExpense);
  const allExpenses   = useExpenseStore((s) => s.expenses);
  const uid = useAuthStore((s) => s.user?.uid ?? '');

  const periods = usePeriodExpenses();
  const currentYear = new Date().getFullYear();
  const yearlySummary = useYearlySummary(currentYear);
  const monthlyBreakdown = useCategoryBreakdown(periods.month.expenses);

  const monthlyData = yearlySummary.monthlySummaries.map((m) => ({
    label: format(new Date(m.year, m.month, 1), 'MMM'),
    total: m.total,
  }));

  const recentExpenses = allExpenses.slice(0, 8);

  const handleAdd = async (data: ExpenseFormData) => {
    try {
      await addExpense(data, uid);
      setAddOpen(false);
      toast.success('Expense added!');
    } catch { toast.error('Failed to add expense.'); }
  };

  const handleEdit = async (data: ExpenseFormData) => {
    if (!editExpense) return;
    try {
      await updateExpense(editExpense.id, data, uid);
      setEditExpense(null);
      toast.success('Expense updated!');
    } catch { toast.error('Failed to update expense.'); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteExpense(deleteId, uid);
      setDeleteId(null);
      toast.success('Deleted.');
    } catch { toast.error('Failed to delete expense.'); }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header
        title="Dashboard"
        subtitle={`Overview · ${formatDate(new Date(), 'EEEE, MMM dd yyyy')}`}
        onMenuToggle={onMenuToggle}
        onAddExpense={() => setAddOpen(true)}
      />

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryCard
            title="Today's Spending"
            value={formatCurrency(periods.today.total)}
            count={periods.today.count}
            icon={<Calendar className="w-5 h-5" />}
            color="#3b82f6"
          />
          <SummaryCard
            title="This Week"
            value={formatCurrency(periods.week.total)}
            count={periods.week.count}
            icon={<Activity className="w-5 h-5" />}
            color="#8b5cf6"
          />
          <SummaryCard
            title="This Month"
            value={formatCurrency(periods.month.total)}
            count={periods.month.count}
            icon={<CreditCard className="w-5 h-5" />}
            color="#f59e0b"
          />
          <SummaryCard
            title="This Year"
            value={formatCurrency(periods.year.total)}
            count={periods.year.count}
            icon={<ShoppingBag className="w-5 h-5" />}
            color="#10b981"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader title="Monthly Spending" subtitle={String(currentYear)} />
            <SpendingBarChart data={monthlyData} />
          </Card>

          <Card>
            <CardHeader title="Category Breakdown" subtitle="This month" />
            <CategoryPieChart data={monthlyBreakdown} />
          </Card>
        </div>

        {/* Top Categories */}
        {monthlyBreakdown.length > 0 && (
          <Card>
            <CardHeader title="Top Categories" subtitle="This month" />
            <div className="space-y-3">
              {monthlyBreakdown.slice(0, 6).map((item) => (
                <div key={item.category} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{item.category}</span>
                      <span className="text-sm font-semibold text-gray-900">{formatCurrency(item.total)}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${item.percentage}%`,
                          backgroundColor: '#3b82f6',
                          opacity: 0.7 + item.percentage / 300,
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 w-10 text-right">{item.percentage.toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Recent Expenses */}
        <Card padding="none">
          <div className="p-5 border-b border-gray-50">
            <CardHeader title="Recent Expenses" subtitle="Latest transactions" />
          </div>
          {recentExpenses.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">
              No expenses yet. Click "Add Expense" to get started.
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentExpenses.map((e) => (
                <ExpenseCard key={e.id} expense={e} onEdit={setEditExpense} onDelete={setDeleteId} />
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Add Modal */}
      <Modal isOpen={addOpen} onClose={() => setAddOpen(false)} title="Add Expense" maxWidth="lg">
        <ExpenseForm onSubmit={handleAdd} onCancel={() => setAddOpen(false)} />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editExpense} onClose={() => setEditExpense(null)} title="Edit Expense" maxWidth="lg">
        {editExpense && (
          <ExpenseForm
            onSubmit={handleEdit}
            onCancel={() => setEditExpense(null)}
            defaultValues={editExpense}
            isEditing
          />
        )}
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Expense"
        message="This action cannot be undone. Are you sure you want to delete this expense?"
      />
    </div>
  );
};
