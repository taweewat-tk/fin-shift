'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, Input, InputNumber, Select } from 'antd';
import { Controller, useForm } from 'react-hook-form';

import { THAI_CARD_ISSUERS } from '@/shared/constants/thai-issuers';

import {
  createCardFormDefaultValues,
  createCardFormSchema,
  type CreateCardFormValues,
} from '../schemas/create-card-schema';

interface CreateCardFormProps {
  onSubmit: (values: CreateCardFormValues) => void;
  isSubmitting?: boolean;
}

const ISSUER_OPTIONS = THAI_CARD_ISSUERS.map(issuer => ({ label: issuer, value: issuer }));

export default function CreateCardForm({ onSubmit, isSubmitting }: CreateCardFormProps) {
  const { control, handleSubmit } = useForm<CreateCardFormValues>({
    defaultValues: createCardFormDefaultValues,
    resolver: zodResolver(createCardFormSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-1">
      <Controller
        name="name"
        control={control}
        render={({ field, fieldState }) => (
          <Form.Item
            label="Card name"
            validateStatus={fieldState.error ? 'error' : ''}
            help={fieldState.error?.message}
          >
            <Input {...field} placeholder="e.g. KBank Visa Signature" />
          </Form.Item>
        )}
      />
      <Controller
        name="issuer"
        control={control}
        render={({ field, fieldState }) => (
          <Form.Item
            label="Issuer"
            validateStatus={fieldState.error ? 'error' : ''}
            help={fieldState.error?.message}
          >
            <Select {...field} options={ISSUER_OPTIONS} placeholder="Select issuer" />
          </Form.Item>
        )}
      />
      <Controller
        name="last4"
        control={control}
        render={({ field, fieldState }) => (
          <Form.Item
            label="Last 4 digits"
            validateStatus={fieldState.error ? 'error' : ''}
            help={fieldState.error?.message}
          >
            <Input {...field} maxLength={4} placeholder="1234" />
          </Form.Item>
        )}
      />
      <Controller
        name="creditLimit"
        control={control}
        render={({ field, fieldState }) => (
          <Form.Item
            label="Credit limit (THB)"
            validateStatus={fieldState.error ? 'error' : ''}
            help={fieldState.error?.message}
          >
            <InputNumber
              {...field}
              min={0}
              style={{ width: '100%' }}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            />
          </Form.Item>
        )}
      />
      <Controller
        name="statementClosingDay"
        control={control}
        render={({ field, fieldState }) => (
          <Form.Item
            label="Statement closing day"
            validateStatus={fieldState.error ? 'error' : ''}
            help={fieldState.error?.message}
          >
            <InputNumber {...field} min={1} max={31} style={{ width: '100%' }} />
          </Form.Item>
        )}
      />
      <Controller
        name="graceDays"
        control={control}
        render={({ field, fieldState }) => (
          <Form.Item
            label="Grace days"
            validateStatus={fieldState.error ? 'error' : ''}
            help={fieldState.error?.message}
          >
            <InputNumber {...field} min={0} style={{ width: '100%' }} />
          </Form.Item>
        )}
      />
      <Button type="primary" htmlType="submit" loading={isSubmitting} block>
        Add card
      </Button>
    </form>
  );
}
