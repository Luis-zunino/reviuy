import { GoodPracticesComponent } from '@/components/features';
import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Buenas prácticas | ReviUy',
  description: 'Guía de buenas prácticas para la comunidad de ReviUy.',
};

export default function GoodPracticesPage() {
  return <GoodPracticesComponent />;
}
