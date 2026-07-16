import { AxiosResponse } from 'axios';

import type { Category } from '@/shared/types/api/categories';

import axiosInstance from '../../axios';
import REQUEST_URL from '../../request-url';

export const getCategories = async (): Promise<Category[]> => {
  const response = await axiosInstance.get<Category[], AxiosResponse<Category[]>>(
    REQUEST_URL.CATEGORIES.LIST
  );
  return response.data;
};
