import { ListRealEstates } from '@/components/features/RealEstate';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Propiedades | Reviuy',
  description: 'Administra tus propiedades en Reviuy.',
};

const RealEstatesPage = () => {
  return <ListRealEstates />;
};

export default RealEstatesPage;
