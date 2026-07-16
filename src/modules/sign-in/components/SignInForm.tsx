'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, Input } from 'antd';
import { Controller, useForm } from 'react-hook-form';

import {
  signInFormDefaultValues,
  signInFormSchema,
  type SignInFormValues,
} from '../schemas/sign-in-schema';

interface SignInFormProps {
  onSubmit: (values: SignInFormValues) => void;
  isSubmitting?: boolean;
}

export default function SignInForm({ onSubmit, isSubmitting }: SignInFormProps) {
  const { control, handleSubmit } = useForm<SignInFormValues>({
    defaultValues: signInFormDefaultValues,
    resolver: zodResolver(signInFormSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full max-w-xs flex-col gap-1">
      <Controller
        name="email"
        control={control}
        render={({ field, fieldState }) => (
          <Form.Item
            validateStatus={fieldState.error ? 'error' : ''}
            help={fieldState.error?.message}
          >
            <Input {...field} size="large" type="email" placeholder="Email" autoComplete="email" />
          </Form.Item>
        )}
      />
      <Controller
        name="password"
        control={control}
        render={({ field, fieldState }) => (
          <Form.Item
            validateStatus={fieldState.error ? 'error' : ''}
            help={fieldState.error?.message}
          >
            <Input.Password
              {...field}
              size="large"
              placeholder="Password"
              autoComplete="current-password"
            />
          </Form.Item>
        )}
      />
      <Button type="primary" size="large" htmlType="submit" loading={isSubmitting} block>
        Log in
      </Button>
    </form>
  );
}
