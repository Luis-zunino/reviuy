import type { Metadata } from 'next';
import '../globals.css';
import { MainLayout } from '@/components/common/MainLayout';

export const metadata: Metadata = {
  title: 'Consejos y Tips | Reviuy',
  description: 'Descubre consejos útiles para alquilar y evaluar propiedades.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <MainLayout>{children}</MainLayout>;
}
