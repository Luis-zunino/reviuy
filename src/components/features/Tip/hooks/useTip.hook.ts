'use client';

import { articles } from '@/services/mocks/articles.mock';
import { useParams } from 'next/navigation';

export const useTip = () => {
  const { id } = useParams<{ id: string }>();

  return {
    tip: articles[Number(id) - 1],
  };
};
