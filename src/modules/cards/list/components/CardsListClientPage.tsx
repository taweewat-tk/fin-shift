'use client';

import { Button, Empty, Spin, Typography } from 'antd';
import { useState } from 'react';

import { useGetCards } from '@/shared/hooks/api/queries/cards/useGetCards';

import CreateCardModal from '../../create/components/CreateCardModal';

import CardListItem from './CardListItem';

export default function CardsListClientPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { data: cards, isLoading } = useGetCards();

  return (
    <main className="mx-auto flex max-w-md flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <Typography.Title level={3} style={{ marginBottom: 0 }}>
          Cards
        </Typography.Title>
        <Button type="primary" onClick={() => setIsCreateOpen(true)}>
          Add card
        </Button>
      </div>

      {isLoading && (
        <div className="flex justify-center py-8">
          <Spin />
        </div>
      )}

      {!isLoading && cards?.length === 0 && (
        <Empty description="No cards yet. Add your first card to start tracking expenses." />
      )}

      {!isLoading && cards && cards.length > 0 && (
        <div className="flex flex-col gap-3">
          {cards.map(card => (
            <CardListItem key={card.id} card={card} />
          ))}
        </div>
      )}

      <CreateCardModal open={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </main>
  );
}
