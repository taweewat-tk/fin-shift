'use client';

import {
  QueryClient,
  QueryClientProvider as ReactQueryClientProvider,
} from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

export const QueryClientProvider = ({ children }: { children: React.ReactNode }) => (
  <ReactQueryClientProvider client={queryClient}>{children}</ReactQueryClientProvider>
);
