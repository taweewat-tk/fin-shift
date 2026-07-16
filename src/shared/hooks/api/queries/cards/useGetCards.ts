import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { getCards } from '@/shared/services/api/cards/cards';
import REQUEST_URL from '@/shared/services/request-url';
import type { Card } from '@/shared/types/api/cards';

export const useGetCards = (options?: Partial<UseQueryOptions<Card[]>>) =>
  useQuery({
    queryKey: [REQUEST_URL.CARDS.LIST],
    queryFn: getCards,
    ...options,
  });
