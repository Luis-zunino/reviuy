import type { UseFormReturn } from 'react-hook-form';
import type { RealEstateReviewWithVotes } from '@/types';
import type { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { FormRealEstateSchema } from '../../types';

export interface RealEstateReviewFormProps {
  form: UseFormReturn<FormRealEstateSchema, undefined, FormRealEstateSchema>;
  handleSubmit: (formData: FormRealEstateSchema) => Promise<void>;
  isSubmitting: boolean;
  title: string;
  subtitle?: string;
  isLoading: boolean;
  error: boolean;
  isReadOnly?: boolean;
  review?: RealEstateReviewWithVotes | null;
  refetchRealEstateReview?: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<RealEstateReviewWithVotes | null, Error>>;
}
