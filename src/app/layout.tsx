import type { Metadata } from 'next';

import { Provider } from '@/providers';

import '@solvprotocol/ui-v2/dist/assets/style.css';
import '@/assets/css/globals.css';

export const metadata: Metadata = {
  title: 'Solv App',
  description: 'Solv App - The Future of Bitcoin Finance',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
