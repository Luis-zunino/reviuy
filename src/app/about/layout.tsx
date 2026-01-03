import type { Metadata } from 'next';
import '../globals.css';
import { MainLayout } from '@/components/common/MainLayout';

export const metadata: Metadata = {
  title: 'Sobre Nosotros | Reviuy',
  description:
    'Conoce más sobre Reviuy, la plataforma de reseñas de alquileres en Uruguay. Nuestra misión, visión y equipo.',
};

export default function AboutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <MainLayout>{children}</MainLayout>;
}
