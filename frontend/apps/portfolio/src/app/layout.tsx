import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ThemeRegistry from '../components/providers/ThemeRegistry';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Whalter Duarte',
  description: 'My Professional Portfolio',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <ThemeRegistry>
        <body className={inter.className} suppressHydrationWarning={true}>
          <div className="min-h-screen bg-gray-50">
            <main>
              {children}
            </main>
          </div>
        </body>
      </ThemeRegistry>
    </html>
  );
}
