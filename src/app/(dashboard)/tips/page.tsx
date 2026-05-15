import { TipsPageComponent } from '@/components/features/Tips';
import { generatePageMetadata } from '@/lib/metadata';

export const metadata = generatePageMetadata({
  title: 'Consejos y Tips | ReviUy',
  description: 'Descubre consejos útiles para alquilar y evaluar propiedades.',
  path: '/tips',
});

const TipsPage = () => {
  return <TipsPageComponent />;
};

export default TipsPage;
