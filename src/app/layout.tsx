import type { Metadata } from 'next';
import '../styles/index.css';
import './globals.scss';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Carbon Design System AI Hub',
  description: 'AI-powered documentation assistant for IBM Carbon Design System',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
