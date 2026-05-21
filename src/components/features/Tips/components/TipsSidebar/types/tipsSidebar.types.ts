import type { TipType } from '@/types/article';

export interface TipsSidebarProps {
  categories: Array<{ name: TipType; count: number }>;
  selectedCategory: TipType;
  setSelectedCategory: (category: TipType) => void;
}
