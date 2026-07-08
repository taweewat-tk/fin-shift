import { AntdRegistry } from '@ant-design/nextjs-registry';
import { App, ConfigProvider } from 'antd';
import type { Metadata } from 'next';
import { Prompt } from 'next/font/google';

import AuthProvider from '@/shared/providers/AuthProvider';
import { QueryClientProvider } from '@/shared/providers/QueryClientProvider';
import '@/styles/globals.css';

const prompt = Prompt({
  variable: '--font-prompt',
  subsets: ['thai', 'latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'fin-shift',
  description: 'Credit-card expense tracking with billing-cycle reminders',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${prompt.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <AntdRegistry>
          <QueryClientProvider>
            <ConfigProvider theme={{ token: { fontFamily: prompt.style.fontFamily } }}>
              <App>
                <AuthProvider>{children}</AuthProvider>
              </App>
            </ConfigProvider>
          </QueryClientProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
