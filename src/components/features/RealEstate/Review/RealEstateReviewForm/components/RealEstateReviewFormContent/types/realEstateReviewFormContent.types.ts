import type { UseFormReturn } from 'react-hook-form';
import { FormRealEstateSchema } from '@/schemas';

export interface RealEstateReviewFormContentProps {
  form: UseFormReturn<FormRealEstateSchema, undefined, FormRealEstateSchema>;
  isReadOnly?: boolean;
}
