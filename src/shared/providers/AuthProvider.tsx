'use client';

import { useEffect } from 'react';

import { useAuthStore } from '@/stores/useAuthStore';

import { useGetMe } from '../hooks/api/queries/me/useGetMe';

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { setUserInfo } = useAuthStore();
  const { data, isSuccess, isError } = useGetMe({ retry: false });

  useEffect(() => {
    if (isSuccess && data) setUserInfo(data);
    if (isError) setUserInfo(null);
  }, [isSuccess, isError, data, setUserInfo]);

  return <>{children}</>;
};

export default AuthProvider;
