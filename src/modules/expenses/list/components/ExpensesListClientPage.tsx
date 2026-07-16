'use client';

import { Button, Empty, Spin, Typography } from 'antd';
import { useState } from 'react';

import { useGetCards } from '@/shared/hooks/api/queries/cards/useGetCards';
import { useGetCategories } from '@/shared/hooks/api/queries/categories/useGetCategories';
import { useGetExpenses } from '@/shared/hooks/api/queries/expenses/useGetExpenses';

import CreateExpenseModal from '../../create/components/CreateExpenseModal';

import ExpenseListItem from './ExpenseListItem';

export default function ExpensesListClientPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { data: expenses, isLoading } = useGetExpenses();
  const { data: cards } = useGetCards();
  const { data: categories } = useGetCategories();

  const sortedExpenses = [...(expenses ?? [])].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <main className="mx-auto flex max-w-md flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <Typography.Title level={3} style={{ marginBottom: 0 }}>
          Expenses
        </Typography.Title>
        <Button type="primary" onClick={() => setIsCreateOpen(true)}>
          Add expense
        </Button>
      </div>

      {isLoading && (
        <div className="flex justify-center py-8">
          <Spin />
        </div>
      )}

      {!isLoading && sortedExpenses.length === 0 && (
        <Empty description="No expenses yet. Add your first expense to start tracking." />
      )}

      {!isLoading && sortedExpenses.length > 0 && (
        <div className="flex flex-col gap-3">
          {sortedExpenses.map(expense => (
            <ExpenseListItem
              key={expense.id}
              expense={expense}
              card={cards?.find(card => card.id === expense.cardId)}
              category={categories?.find(category => category.id === expense.categoryId)}
            />
          ))}
        </div>
      )}

      <CreateExpenseModal open={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </main>
  );
}
