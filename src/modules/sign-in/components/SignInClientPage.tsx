'use client';

import { App, Typography } from 'antd';

import PAGE_ROUTES from '@/shared/constants/page-routes';
import { useLogin } from '@/shared/hooks/api/mutations/auth/useLogin';

import type { SignInFormValues } from '../schemas/sign-in-schema';

import SignInForm from './SignInForm';

export default function SignInClientPage() {
  const { message } = App.useApp();
  const { mutate, isPending } = useLogin();

  const handleSubmit = (values: SignInFormValues) => {
    mutate(values, {
      onSuccess: () => {
        // Full reload so the server (withAuth) picks up the httpOnly session cookie.
        window.location.href = PAGE_ROUTES.DASHBOARD;
      },
      onError: () => {
        message.error('Invalid email or password');
      },
    });
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-8">
      <div className="text-center">
        <Typography.Title level={2} style={{ marginBottom: 0 }}>
          fin-shift
        </Typography.Title>
        <Typography.Text type="secondary">Track credit-card spend, by cycle.</Typography.Text>
      </div>
      <SignInForm onSubmit={handleSubmit} isSubmitting={isPending} />
    </div>
  );
}
