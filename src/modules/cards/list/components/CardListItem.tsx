import { Card as AntCard, Typography } from 'antd';

import type { Card } from '@/shared/types/api/cards';

interface CardListItemProps {
  card: Card;
}

export default function CardListItem({ card }: CardListItemProps) {
  const creditLimit = Number(card.creditLimit).toLocaleString('en-US');

  return (
    <AntCard size="small">
      <div className="flex items-center justify-between">
        <div>
          <Typography.Text strong>{card.name}</Typography.Text>
          <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
            {card.issuer} •••• {card.last4}
          </Typography.Paragraph>
        </div>
        <Typography.Text>฿{creditLimit}</Typography.Text>
      </div>
      <div className="mt-2 flex gap-4 text-sm text-zinc-500">
        <span>Closes day {card.statementClosingDay}</span>
        <span>{card.graceDays} grace days</span>
      </div>
    </AntCard>
  );
}
