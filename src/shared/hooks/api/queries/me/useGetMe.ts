import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { getMe } from '@/shared/services/api/me/me';
import REQUEST_URL from '@/shared/services/request-url';
import type { AuthUser } from '@/shared/types/api/auth';

export const useGetMe = (options?: Partial<UseQueryOptions<AuthUser>>) =>
  useQuery({
    queryKey: [REQUEST_URL.ME.GET],
    queryFn: getMe,
    ...options,
  });
