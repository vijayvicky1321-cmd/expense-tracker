import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Plus, LayoutList, Table2, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { ExpenseForm } from '../components/expense/ExpenseForm';
import { ExpenseFilters } from '../components/expense/ExpenseFilters';
import { ExpenseCard } from '../components/expense/ExpenseCard';
import { ExpenseTable } from '../components/expense/ExpenseTable';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { EmptyState } from '../components/ui/EmptyState';
import { useExpenseStore } from '../store/useExpenseStore';
import { useAuthStore } from '../store/useAuthStore';
import { useFilteredExpenses, useDailyGroups } from '../hooks/useExpenses';
import { formatCurrency, formatDate } from '../utils/date';
import { exportToCSV, exportToExcel, exportToPDF } from '../services/exportService';
import type { Expense, ExpenseFormData } from '../types';

type ViewMode = 'list' | 'table';

export const Expenses: React.FC = () => {
  const { onMenuToggle } = useOutletContext<{ onMenuToggle: () => void }>();
  const [addOpen, setAddOpen] = useState(false);
  const [editExpense, setEditExpense] = useState<Expense | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const addExpense    = useExpenseStore((s) => s.addExpense);
  const updateExpense = useExpenseStore((s) => s.updateExpense);
  const deleteExpense = useExpenseStore((s) => s.deleteExpense);
  const uid = useAuthStore((s) => s.user?.uid ?? '');

  const filtered = useFilteredExpenses();
  const dailyGroups = useDailyGroups(filtered);
  const totalFiltered = filtered.reduce((s, e) => s + e.amount, 0);

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
    } catch { toast.error('Failed to delete.'); }
  };

  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    if (format === 'csv') exportToCSV(filtered, 'expenses');
    else if (format === 'excel') exportToExcel(filtered, 'expenses');
    else exportToPDF(filtered, 'Expense Report');
    toast.success(`Exported as ${format.toUpperCase()}`);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header
        title="Expenses"
        subtitle={`${filtered.length} transactions · ${formatCurrency(totalFiltered)} total`}
        onMenuToggle={onMenuToggle}
        onAddExpense={() => setAddOpen(true)}
      />

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        <ExpenseFilters />

        {/* Toolbar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 bg-white border border-gray-100 rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-primary-50 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <LayoutList className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'table' ? 'bg-primary-50 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Table2 className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-2">
            {(['csv', 'excel', 'pdf'] as const).map((fmt) => (
              <Button
                key={fmt}
                variant="secondary"
                size="sm"
                icon={<Download className="w-3.5 h-3.5" />}
                onClick={() => handleExport(fmt)}
                disabled={filtered.length === 0}
              >
                {fmt.toUpperCase()}
              </Button>
            ))}
          </div>
        </div>

        {/* Content */}
        {filtered.length === 0 ? (
          <Card>
            <EmptyState action={<Button onClick={() => setAddOpen(true)} icon={<Plus className="w-4 h-4" />}>Add Expense</Button>} />
          </Card>
        ) : viewMode === 'table' ? (
          <Card padding="none">
            <ExpenseTable expenses={filtered} onEdit={setEditExpense} onDelete={setDeleteId} />
          </Card>
        ) : (
          <div className="space-y-4">
            {dailyGroups.map((group) => (
              <Card key={group.date} padding="none">
                <div className="flex items-center justify-between px-5 py-3 border-b border-gray-50">
                  <p className="text-sm font-semibold text-gray-700">{formatDate(group.date, 'EEEE, MMMM dd')}</p>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{formatCurrency(group.total)}</p>
                    <p className="text-xs text-gray-400">{group.count} transactions</p>
                  </div>
                </div>
                <div className="divide-y divide-gray-50">
                  {group.expenses.map((e) => (
                    <ExpenseCard key={e.id} expense={e} onEdit={setEditExpense} onDelete={setDeleteId} />
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={addOpen} onClose={() => setAddOpen(false)} title="Add Expense" maxWidth="lg">
        <ExpenseForm onSubmit={handleAdd} onCancel={() => setAddOpen(false)} />
      </Modal>

      <Modal isOpen={!!editExpense} onClose={() => setEditExpense(null)} title="Edit Expense" maxWidth="lg">
        {editExpense && (
          <ExpenseForm onSubmit={handleEdit} onCancel={() => setEditExpense(null)} defaultValues={editExpense} isEditing />
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Expense"
        message="This cannot be undone."
      />
    </div>
  );
};
