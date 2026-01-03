import type { RealEstate } from '@/types';

export interface RealEstateSidebarProps {
  searchValue: string | null;
  selectedRealEstate: RealEstate | null;
  selectedRating: number;
  setSearchValue: (value: string) => void;
  handleRealEstateSelect: (realEstate: RealEstate | null) => void;
  setSelectedRating: (rating: number) => void;
  handleClearFilters: () => void;
}
