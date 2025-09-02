import './globals.css';
import { Inter } from 'next/font/google';

import Footer from '@/components/footer';
import Header from '@/components/header';

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
          {children}
          <div className='mt-auto'>
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
