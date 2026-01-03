import type { RealEstate } from '@/types';

export interface UseRealEstateSearchInputProps {
  onRealEstateSelect: (realEstate: RealEstate | null) => void;
  selectedRealEstate?: RealEstate | null;
  onChange?: (value: string) => void;
  value: string | null;
}
