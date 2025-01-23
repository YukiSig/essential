'use client';
import { Inter } from 'next/font/google';
import './globals.css';
import { MockProvider } from './mockProvider';
import Header from '@/components/Header';
import { RecoilRoot } from 'recoil';

const inter = Inter({ subsets: ['latin'] });

const metadata = {
  title: 'Mini Zenn🍺',
  description: 'Article sharing application',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <title>{metadata.title}</title>
      <meta name="description" content={metadata.description} />
      <body className={inter.className}>
        {process.env.NODE_ENV === 'production' && (
          <RecoilRoot>
            <Header />
            {children}
          </RecoilRoot>
        )}
        {process.env.NODE_ENV === 'development' && (
          <MockProvider>
            <RecoilRoot>
              <Header />
              {children}
            </RecoilRoot>
          </MockProvider>
        )}
      </body>
    </html>
  );
}
