import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';

import MainHeader from '../../components/MainHeader/MainHeader';

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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <MainHeader></MainHeader>
        {children}
      </body>
    </html>
  );
}
