import type { UseFormReturn } from 'react-hook-form';
import { FormRealEstateSchema } from '../../../../types';

export interface RealEstateReviewFormContentProps {
  form: UseFormReturn<FormRealEstateSchema, undefined, FormRealEstateSchema>;
  isReadOnly?: boolean;
}
