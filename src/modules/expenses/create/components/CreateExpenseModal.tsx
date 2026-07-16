'use client';

import { App, Modal } from 'antd';

import { useCreateExpense } from '@/shared/hooks/api/mutations/expenses/useCreateExpense';
import { useGetCards } from '@/shared/hooks/api/queries/cards/useGetCards';
import { useGetCategories } from '@/shared/hooks/api/queries/categories/useGetCategories';

import type { CreateExpenseFormValues } from '../schemas/create-expense-schema';

import CreateExpenseForm from './CreateExpenseForm';

interface CreateExpenseModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateExpenseModal({ open, onClose }: CreateExpenseModalProps) {
  const { message } = App.useApp();
  const { data: cards } = useGetCards({ enabled: open });
  const { data: categories } = useGetCategories({ enabled: open });
  const { mutate, isPending } = useCreateExpense();

  const handleSubmit = (values: CreateExpenseFormValues) => {
    mutate(
      { ...values, merchant: values.merchant || undefined },
      {
        onSuccess: () => {
          message.success('Expense added');
          onClose();
        },
        onError: () => {
          message.error('Could not add the expense. Check the details and try again.');
        },
      }
    );
  };

  return (
    <Modal title="Add an expense" open={open} onCancel={onClose} footer={null} destroyOnHidden>
      {cards && cards.length === 0 && (
        <p className="text-zinc-500">Add a card first before recording an expense.</p>
      )}
      {cards && cards.length > 0 && categories && (
        <CreateExpenseForm
          cards={cards}
          categories={categories}
          onSubmit={handleSubmit}
          isSubmitting={isPending}
        />
      )}
    </Modal>
  );
}
