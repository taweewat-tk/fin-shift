'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, DatePicker, Form, Input, InputNumber, Select } from 'antd';
import dayjs from 'dayjs';
import { Controller, useForm } from 'react-hook-form';

import type { Card } from '@/shared/types/api/cards';
import type { Category } from '@/shared/types/api/categories';

import {
  createExpenseFormDefaultValues,
  createExpenseFormSchema,
  type CreateExpenseFormValues,
} from '../schemas/create-expense-schema';

interface CreateExpenseFormProps {
  cards: Card[];
  categories: Category[];
  onSubmit: (values: CreateExpenseFormValues) => void;
  isSubmitting?: boolean;
}

export default function CreateExpenseForm({
  cards,
  categories,
  onSubmit,
  isSubmitting,
}: CreateExpenseFormProps) {
  const { control, handleSubmit } = useForm<CreateExpenseFormValues>({
    defaultValues: {
      ...createExpenseFormDefaultValues,
      cardId: cards[0]?.id ?? '',
    },
    resolver: zodResolver(createExpenseFormSchema),
  });

  const cardOptions = cards.map(card => ({
    label: `${card.name} •••• ${card.last4}`,
    value: card.id,
  }));
  const categoryOptions = categories.map(category => ({
    label: category.name,
    value: category.id,
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-1">
      <Controller
        name="amount"
        control={control}
        render={({ field, fieldState }) => (
          <Form.Item
            label="Amount (THB)"
            validateStatus={fieldState.error ? 'error' : ''}
            help={fieldState.error?.message}
          >
            <InputNumber
              {...field}
              autoFocus
              min={0}
              size="large"
              style={{ width: '100%' }}
              placeholder="0.00"
            />
          </Form.Item>
        )}
      />
      <Controller
        name="cardId"
        control={control}
        render={({ field, fieldState }) => (
          <Form.Item
            label="Card"
            validateStatus={fieldState.error ? 'error' : ''}
            help={fieldState.error?.message}
          >
            <Select {...field} options={cardOptions} placeholder="Select card" />
          </Form.Item>
        )}
      />
      <Controller
        name="categoryId"
        control={control}
        render={({ field, fieldState }) => (
          <Form.Item
            label="Category"
            validateStatus={fieldState.error ? 'error' : ''}
            help={fieldState.error?.message}
          >
            <Select {...field} options={categoryOptions} placeholder="Select category" />
          </Form.Item>
        )}
      />
      <Controller
        name="date"
        control={control}
        render={({ field, fieldState }) => (
          <Form.Item
            label="Date"
            validateStatus={fieldState.error ? 'error' : ''}
            help={fieldState.error?.message}
          >
            <DatePicker
              value={field.value ? dayjs(field.value) : null}
              onChange={value => field.onChange(value ? value.format('YYYY-MM-DD') : '')}
              style={{ width: '100%' }}
            />
          </Form.Item>
        )}
      />
      <Controller
        name="merchant"
        control={control}
        render={({ field }) => (
          <Form.Item label="Merchant (optional)">
            <Input {...field} value={field.value ?? ''} placeholder="e.g. Starbucks" />
          </Form.Item>
        )}
      />
      <Button type="primary" htmlType="submit" loading={isSubmitting} block>
        Add expense
      </Button>
    </form>
  );
}
