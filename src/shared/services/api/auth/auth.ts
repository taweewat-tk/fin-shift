import { AxiosResponse } from 'axios';

import type { LoginPayload, LoginResponse } from '@/shared/types/api/auth';

import axiosInstance from '../../axios';
import REQUEST_URL from '../../request-url';

export const postLogin = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse, AxiosResponse<LoginResponse>>(
    REQUEST_URL.AUTH.LOGIN,
    payload
  );
  return response.data;
};

export const postLogout = async (): Promise<void> => {
  await axiosInstance.post(REQUEST_URL.AUTH.LOGOUT);
};
