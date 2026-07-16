import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { getExpenses } from '@/shared/services/api/expenses/expenses';
import REQUEST_URL from '@/shared/services/request-url';
import type { Expense } from '@/shared/types/api/expenses';

export const useGetExpenses = (options?: Partial<UseQueryOptions<Expense[]>>) =>
  useQuery({
    queryKey: [REQUEST_URL.EXPENSES.LIST],
    queryFn: getExpenses,
    ...options,
  });
