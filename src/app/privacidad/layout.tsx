import type { Metadata } from 'next';
import '../globals.css';
import { MainLayout } from '@/components/common/MainLayout';

export const metadata: Metadata = {
  title: 'Política de Privacidad | Reviuy',
  description: 'Conoce nuestra política de privacidad y cómo protegemos tus datos.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <MainLayout>{children}</MainLayout>;
}
