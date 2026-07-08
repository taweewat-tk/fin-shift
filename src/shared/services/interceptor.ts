import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

import PAGE_ROUTES from '../constants/page-routes';

interface ErrorResponseData {
  message?: string;
  code?: string;
}

// Web relies on the httpOnly session cookie, sent automatically on same-origin
// requests. The native app shell has no cookie jar, so it authenticates via
// Bearer instead (ADR-012) — it calls setBearerToken() after its own login.
let bearerToken: string | undefined;

export function setBearerToken(token: string | undefined): void {
  bearerToken = token;
}

// Guard against a redirect loop: the sign-in page itself calls GET /me to
// check for an existing session, which 401s harmlessly when logged out.
const redirectToSignIn = (): void => {
  if (typeof window !== 'undefined' && window.location.pathname !== PAGE_ROUTES.SIGN_IN) {
    window.location.href = PAGE_ROUTES.SIGN_IN;
  }
};

const requestInterceptor = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  if (bearerToken && config.headers) {
    config.headers.Authorization = `Bearer ${bearerToken}`;
  }
  return config;
};

const responseInterceptor = (response: AxiosResponse): AxiosResponse => response;

const responseErrorHandler = (error: AxiosError): Promise<never> => {
  const { response } = error;
  if (!response) {
    return Promise.reject(new Error('Unable to reach the server. Please try again.'));
  }

  const { status, data } = response;
  const errorData = data as ErrorResponseData;

  if (status === 401) {
    redirectToSignIn();
  }

  return Promise.reject(new Error(errorData?.message ?? `Request failed with status ${status}`));
};

export const setupAxiosInterceptors = (axiosInstance: AxiosInstance): AxiosInstance => {
  axiosInstance.interceptors.request.use(requestInterceptor);
  axiosInstance.interceptors.response.use(responseInterceptor, responseErrorHandler);
  return axiosInstance;
};
