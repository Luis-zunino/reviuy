import type { TipType } from '@/types';

export interface TipsSidebarProps {
  categories: Array<{ name: TipType; count: number }>;
  selectedCategory: TipType;
  setSelectedCategory: (category: TipType) => void;
}
