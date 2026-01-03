import type { Metadata } from 'next';
import '../globals.css';
import { MainLayout } from '@/components/common/MainLayout';

export const metadata: Metadata = {
  title: 'Mi Perfil | Reviuy',
  description: 'Administra tu perfil, reseñas y configuraciones en Reviuy.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <MainLayout>{children}</MainLayout>;
}
