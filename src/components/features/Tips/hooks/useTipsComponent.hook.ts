import { tips } from '@/services/mocks/tips.mock';
import { TipType } from '@/types';
import { useState } from 'react';

export const useTipsComponent = () => {
  const [selectedCategory, setSelectedCategory] = useState<TipType>(TipType.ALL);

  const categoryCounts = tips.reduce(
    (acc, article) => {
      acc[article.category] = (acc[article.category] ?? 0) + 1;
      return acc;
    },
    {
      [TipType.CONTRACTS]: 0,
      [TipType.FINANCE]: 0,
      [TipType.SECURITY]: 0,
      [TipType.LEGAL]: 0,
      [TipType.TIPS]: 0,
      [TipType.GUIDES]: 0,
    } as Record<TipType, number>
  );

  const categories = [
    { name: TipType.ALL, count: tips.length },
    { name: TipType.CONTRACTS, count: categoryCounts[TipType.CONTRACTS] },
    { name: TipType.FINANCE, count: categoryCounts[TipType.FINANCE] },
    { name: TipType.SECURITY, count: categoryCounts[TipType.SECURITY] },
    { name: TipType.LEGAL, count: categoryCounts[TipType.LEGAL] },
    { name: TipType.TIPS, count: categoryCounts[TipType.TIPS] },
    { name: TipType.GUIDES, count: categoryCounts[TipType.GUIDES] },
  ];

  const filteredTips =
    selectedCategory === TipType.ALL
      ? tips
      : tips.filter((article) => article.category === selectedCategory);

  return { categories, filteredTips, selectedCategory, setSelectedCategory };
};
