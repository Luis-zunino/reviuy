import type { NominatimEntity } from '@/types';

export interface SearchableSelectRef {
  options: NominatimEntity[];
  value?: NominatimEntity;
  onValueChange?: (value?: string) => void;
  disabled: boolean;
  onBlur?: () => void;
  ref: React.Ref<HTMLInputElement>;
  onInputChange?: (value?: string) => void;
}
