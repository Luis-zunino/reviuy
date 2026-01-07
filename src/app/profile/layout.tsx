import type { Metadata } from 'next';
import '../globals.css';
import { MainLayout } from '@/components/common/MainLayout';
import { AuthProvider } from '@/components/providers/AuthProvider';

export const metadata: Metadata = {
  title: 'Mi Perfil | Reviuy',
  description: 'Administra tu perfil, reseñas y configuraciones en Reviuy.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <MainLayout>
      <AuthProvider>{children}</AuthProvider>
    </MainLayout>
  );
}
