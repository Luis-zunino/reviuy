import type { Metadata } from 'next';
import '../globals.css';
import { MainLayout } from '@/components/common/MainLayout';

export const metadata: Metadata = {
  title: 'Términos y Condiciones | Reviuy',
  description: 'Lee los términos y condiciones de uso de la plataforma Reviuy.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <MainLayout>{children}</MainLayout>;
}
