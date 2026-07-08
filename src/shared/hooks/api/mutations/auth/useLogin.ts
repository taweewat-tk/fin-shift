import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { postLogin } from '@/shared/services/api/auth/auth';
import type { LoginPayload, LoginResponse } from '@/shared/types/api/auth';

export const useLogin = () =>
  useMutation<LoginResponse, AxiosError, LoginPayload>({
    mutationFn: postLogin,
  });
