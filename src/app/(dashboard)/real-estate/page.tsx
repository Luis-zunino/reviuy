import { ListRealEstates } from '@/components/features/RealEstate';
import { generatePageMetadata } from '@/lib/metadata';

export const metadata = generatePageMetadata({
  title: 'Propiedades | ReviUy',
  description: 'Administra tus propiedades en ReviUy.',
  path: '/real-estate',
});

const RealEstatesPage = () => {
  return <ListRealEstates />;
};

export default RealEstatesPage;
