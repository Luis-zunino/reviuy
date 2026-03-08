import { ListRealEstates } from '@/components/features/RealEstate';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Propiedades | ReviUy',
  description: 'Administra tus propiedades en ReviUy.',
};

const RealEstatesPage = () => {
  return <ListRealEstates />;
};

export default RealEstatesPage;
