import { TipsPageComponent } from '@/components/features/Tips';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Consejos y Tips | Reviuy',
  description: 'Descubre consejos útiles para alquilar y evaluar propiedades.',
};

const TipsPage = () => {
  return <TipsPageComponent />;
};

export default TipsPage;
