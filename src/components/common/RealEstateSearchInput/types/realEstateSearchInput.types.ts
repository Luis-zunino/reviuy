import type { RealEstate } from '@/types';

export interface RealEstateSearchInputProps {
  placeholder?: string;
  onRealEstateSelect: (realEstate: RealEstate | null) => void;
  selectedRealEstate?: RealEstate | null;
  isModal?: boolean;
  value: string | null;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  name?: string;
  disabled?: boolean;
}
