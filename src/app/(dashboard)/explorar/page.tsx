import { ExploreReviews } from '@/components/features/Review/ExploreReviews';
import { generatePageMetadata } from '@/lib/metadata';

export const metadata = generatePageMetadata({
  title: 'Explorar reseñas por zona | ReviUy',
  description:
    'Descubre reseñas de propiedades en tu zona. Usa tu ubicación o busca por barrio para encontrar opiniones reales de inquilinos en Uruguay.',
  path: '/explorar',
  keywords: [
    'reseñas',
    'reseñas por zona',
    'reseñas cercanas',
    'opiniones barrio',
    'propiedades cercanas uruguay',
    'alquiler por zona',
  ],
});

const ExplorarPage = () => {
  return <ExploreReviews />;
};

export default ExplorarPage;
