import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { postExpense } from '@/shared/services/api/expenses/expenses';
import REQUEST_URL from '@/shared/services/request-url';
import type { CreateExpensePayload, Expense } from '@/shared/types/api/expenses';

export const useCreateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation<Expense, AxiosError, CreateExpensePayload>({
    mutationFn: postExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REQUEST_URL.EXPENSES.LIST] });
    },
  });
};
