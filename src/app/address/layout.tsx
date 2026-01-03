import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/sonner';
import '../globals.css';
import { MainLayout } from '@/components/common/MainLayout';

export const metadata: Metadata = {
  title: 'Buscar Dirección | Reviuy',
  description: 'Busca y encuentra reseñas por dirección exacta.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <MainLayout>{children}</MainLayout>
      <Toaster richColors />
    </div>
  );
}
