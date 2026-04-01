import { Home } from '@/components/features/Home';
import { generatePageMetadata } from '@/lib/metadata';

export const metadata = generatePageMetadata({
  title: 'Inicio | ReviUy',
  description: 'Bienvenido a ReviUy, la plataforma para evaluar y encontrar tu próximo hogar.',
  path: '/home',
});

export default function HomePage() {
  return <Home />;
}
