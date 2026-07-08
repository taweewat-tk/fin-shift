import { AxiosResponse } from 'axios';

import type { AuthUser } from '@/shared/types/api/auth';

import axiosInstance from '../../axios';
import REQUEST_URL from '../../request-url';

export const getMe = async (): Promise<AuthUser> => {
  const response = await axiosInstance.get<AuthUser, AxiosResponse<AuthUser>>(REQUEST_URL.ME.GET);
  return response.data;
};
