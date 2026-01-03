import { articles } from '@/services/mocks/articles.mock';
import { ArticleType } from '@/types';
import { useState } from 'react';

export const useTipsComponent = () => {
  const [selectedCategory, setSelectedCategory] = useState<ArticleType>(ArticleType.ALL);

  const categoryCounts = articles.reduce(
    (acc, article) => {
      acc[article.category] = (acc[article.category] ?? 0) + 1;
      return acc;
    },
    {
      [ArticleType.CONTRACTS]: 0,
      [ArticleType.FINANCE]: 0,
      [ArticleType.SECURITY]: 0,
      [ArticleType.LEGAL]: 0,
      [ArticleType.TIPS]: 0,
      [ArticleType.GUIDES]: 0,
    } as Record<ArticleType, number>
  );

  const categories = [
    { name: ArticleType.ALL, count: articles.length },
    { name: ArticleType.CONTRACTS, count: categoryCounts[ArticleType.CONTRACTS] },
    { name: ArticleType.FINANCE, count: categoryCounts[ArticleType.FINANCE] },
    { name: ArticleType.SECURITY, count: categoryCounts[ArticleType.SECURITY] },
    { name: ArticleType.LEGAL, count: categoryCounts[ArticleType.LEGAL] },
    { name: ArticleType.TIPS, count: categoryCounts[ArticleType.TIPS] },
    { name: ArticleType.GUIDES, count: categoryCounts[ArticleType.GUIDES] },
  ];

  const filteredArticles =
    selectedCategory === ArticleType.ALL
      ? articles
      : articles.filter((article) => article.category === selectedCategory);

  return { categories, filteredArticles, selectedCategory, setSelectedCategory };
};
