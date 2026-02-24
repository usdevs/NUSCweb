import './globals.css';

import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Inter } from 'next/font/google';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'NUS College Club',
  description: 'NUS College Student Life Portal',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <div className='flex min-h-screen flex-col bg-white'>
          <Header />
          <main className='flex grow flex-col'>{children}</main>
          <Toaster richColors position='bottom-center' />
          <Footer />
        </div>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
