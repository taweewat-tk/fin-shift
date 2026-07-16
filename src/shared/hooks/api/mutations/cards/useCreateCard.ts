import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { postCard } from '@/shared/services/api/cards/cards';
import REQUEST_URL from '@/shared/services/request-url';
import type { Card, CreateCardPayload } from '@/shared/types/api/cards';

export const useCreateCard = () => {
  const queryClient = useQueryClient();

  return useMutation<Card, AxiosError, CreateCardPayload>({
    mutationFn: postCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REQUEST_URL.CARDS.LIST] });
    },
  });
};
