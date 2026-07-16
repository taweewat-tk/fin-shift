import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { getCategories } from '@/shared/services/api/categories/categories';
import REQUEST_URL from '@/shared/services/request-url';
import type { Category } from '@/shared/types/api/categories';

export const useGetCategories = (options?: Partial<UseQueryOptions<Category[]>>) =>
  useQuery({
    queryKey: [REQUEST_URL.CATEGORIES.LIST],
    queryFn: getCategories,
    ...options,
  });
