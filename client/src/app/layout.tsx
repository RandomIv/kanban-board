import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';

import './globals.css';
import '../lib/fontawesome';

import MainHeader from '../components/MainHeader/MainHeader';
import Providers from '@/components/Providers';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: 'Kanban App',
  description: 'A Cool Kanban App',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <MainHeader />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
