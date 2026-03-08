import { Metadata } from 'next';
import { Home } from '@/components/features/Home';

export const metadata: Metadata = {
  title: 'Inicio | ReviUy',
  description: 'Bienvenido a ReviUy, la plataforma para evaluar y encontrar tu próximo hogar.',
};

export default function HomePage() {
  return <Home />;
}
