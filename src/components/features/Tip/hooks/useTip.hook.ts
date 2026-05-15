'use client';

import { tips } from '@/modules/content/data';
import { useParams } from 'next/navigation';

export const useTip = () => {
  const { id } = useParams<{ id: string }>();
  const tip = tips.find((tip) => tip.id === id);

  return { tip };
};
