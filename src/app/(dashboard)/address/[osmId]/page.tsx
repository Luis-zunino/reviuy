import { ViewAddressReviews } from '@/components/features/Review/ViewAddressReviews';
import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Buscar Dirección | ReviUy',
  description: 'Busca y encuentra reseñas por dirección exacta.',
};

const Address = () => {
  return <ViewAddressReviews />;
};

export default Address;
