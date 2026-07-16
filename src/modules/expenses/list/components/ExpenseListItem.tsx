import { Card as AntCard, Typography } from 'antd';
import dayjs from 'dayjs';

import type { Card } from '@/shared/types/api/cards';
import type { Category } from '@/shared/types/api/categories';
import type { Expense } from '@/shared/types/api/expenses';

interface ExpenseListItemProps {
  expense: Expense;
  card: Card | undefined;
  category: Category | undefined;
}

export default function ExpenseListItem({ expense, card, category }: ExpenseListItemProps) {
  const amount = Number(expense.amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <AntCard size="small">
      <div className="flex items-center justify-between">
        <div>
          <Typography.Text strong>
            {expense.merchant || category?.name || 'Expense'}
          </Typography.Text>
          <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
            {category?.name} • {card?.name ?? 'Unknown card'}
          </Typography.Paragraph>
        </div>
        <div className="text-right">
          <Typography.Text strong>฿{amount}</Typography.Text>
          <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
            {dayjs(expense.date).format('D MMM YYYY')}
          </Typography.Paragraph>
        </div>
      </div>
    </AntCard>
  );
}
