import type { Control, FieldErrors } from 'react-hook-form';
import type { ReviewFormData } from '@/types';

export interface ThirdFormProps {
  control: Control<ReviewFormData, unknown, ReviewFormData>;
  defaultRealEstateId?: string | null;
  errors?: FieldErrors<ReviewFormData>;
}
