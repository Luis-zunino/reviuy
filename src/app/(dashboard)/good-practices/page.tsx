import { GoodPracticesComponent } from '@/components/features';
import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Buenas prácticas | Reviuy',
  description: 'Guía de buenas prácticas para la comunidad de Reviuy.',
};

export default function GoodPracticesPage() {
  return <GoodPracticesComponent />;
}
