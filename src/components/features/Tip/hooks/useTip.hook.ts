'use client';

import { tips } from '@/services/mocks/tips.mock';
import { useParams } from 'next/navigation';

export const useTip = () => {
  const { id } = useParams<{ id: string }>();
  const tip = tips.find((tip) => tip.id === id);

  return { tip };
};
