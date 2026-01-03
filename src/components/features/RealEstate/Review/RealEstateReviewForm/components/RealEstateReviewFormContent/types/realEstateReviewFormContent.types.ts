import type { RealEstateReviewUpdate } from '@/types';
import type { UseFormReturn } from 'react-hook-form';

export interface RealEstateReviewFormContentProps<RR extends RealEstateReviewUpdate> {
  form: UseFormReturn<RR, undefined, RR>;
  isReadOnly?: boolean;
}
