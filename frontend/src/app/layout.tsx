import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NeuraChat - AI-Powered Messaging',
  description: 'Modern messaging platform with AI capabilities',
  icons: {
    icon: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className}`} style={{ background: '#F5EFEA', color: '#3A2A20' }}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}