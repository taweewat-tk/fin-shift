import { AxiosResponse } from 'axios';

import type { Card, CreateCardPayload } from '@/shared/types/api/cards';

import axiosInstance from '../../axios';
import REQUEST_URL from '../../request-url';

export const getCards = async (): Promise<Card[]> => {
  const response = await axiosInstance.get<Card[], AxiosResponse<Card[]>>(REQUEST_URL.CARDS.LIST);
  return response.data;
};

export const postCard = async (payload: CreateCardPayload): Promise<Card> => {
  const response = await axiosInstance.post<Card, AxiosResponse<Card>>(
    REQUEST_URL.CARDS.CREATE,
    payload
  );
  return response.data;
};
