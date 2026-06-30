import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { CATEGORIES, PAYMENT_METHODS } from '../../constants';
import type { Expense, ExpenseFormData } from '../../types';
import { todayISO } from '../../utils/date';

const schema = z.object({
  date: z.string().min(1, 'Date is required'),
  amount: z.coerce
    .number({ message: 'Must be a number' })
    .positive('Amount must be positive'),
  category: z.string().min(1, 'Category is required'),
  paymentMethod: z.string().min(1, 'Payment method is required'),
  description: z.string().min(1, 'Description is required').max(200),
  notes: z.string().max(500).optional(),
});

interface ExpenseFormProps {
  onSubmit: (data: ExpenseFormData) => void;
  onCancel: () => void;
  defaultValues?: Partial<Expense>;
  isEditing?: boolean;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSubmit, onCancel, defaultValues, isEditing }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      date: defaultValues?.date ?? todayISO(),
      amount: defaultValues?.amount ?? ('' as unknown as number),
      category: defaultValues?.category ?? '',
      paymentMethod: defaultValues?.paymentMethod ?? '',
      description: defaultValues?.description ?? '',
      notes: defaultValues?.notes ?? '',
    },
  });

  const categoryOptions = CATEGORIES.map((c) => ({ value: c, label: c }));
  const paymentOptions = PAYMENT_METHODS.map((p) => ({ value: p, label: p }));

  const onValid = (data: any) => onSubmit(data as ExpenseFormData);

  return (
    <form onSubmit={handleSubmit(onValid)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Date" type="date" error={errors.date?.message as string} {...register('date')} />
        <Input
          label="Amount (₹)"
          type="number"
          step="0.01"
          placeholder="0.00"
          error={errors.amount?.message as string}
          {...register('amount')}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Category"
          options={categoryOptions}
          placeholder="Select category"
          error={errors.category?.message as string}
          {...register('category')}
        />
        <Select
          label="Payment Method"
          options={paymentOptions}
          placeholder="Select method"
          error={errors.paymentMethod?.message as string}
          {...register('paymentMethod')}
        />
      </div>

      <Input
        label="Description"
        placeholder="What did you spend on?"
        error={errors.description?.message as string}
        {...register('description')}
      />

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Notes (optional)</label>
        <textarea
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          rows={3}
          placeholder="Any additional notes..."
          {...register('notes')}
        />
        {errors.notes && <p className="text-xs text-red-500">{errors.notes.message as string}</p>}
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="secondary" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="flex-1" loading={isSubmitting}>
          {isEditing ? 'Update Expense' : 'Add Expense'}
        </Button>
      </div>
    </form>
  );
};
