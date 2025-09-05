import './globals.css';
import { Inter } from 'next/font/google';

import Footer from '@/components/footer';
import Header from '@/components/header';
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
        <div className='min-h-screen bg-white'>
          <Header />
          <main>{children}</main>
          <Toaster richColors />
          <div className='mt-auto'>
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
