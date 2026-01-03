import type { ArticleType } from '@/types';

export interface TipsSidebarProps {
  categories: Array<{ name: ArticleType; count: number }>;
  selectedCategory: ArticleType;
  setSelectedCategory: (category: ArticleType) => void;
}
