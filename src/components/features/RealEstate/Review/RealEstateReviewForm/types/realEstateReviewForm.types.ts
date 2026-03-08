import type { UseFormReturn } from 'react-hook-form';
import type { RealEstateReviewWithVotesPublic } from '@/types';
import type { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { FormRealEstateSchema } from '@/schemas';

export interface RealEstateReviewFormProps {
  form: UseFormReturn<FormRealEstateSchema, undefined, FormRealEstateSchema>;
  handleSubmit: (formData: FormRealEstateSchema) => Promise<void>;
  isSubmitting: boolean;
  title: string;
  subtitle?: string;
  isLoading: boolean;
  error: boolean;
  isReadOnly?: boolean;
  review?: RealEstateReviewWithVotesPublic | null;
  refetchRealEstateReview?: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<RealEstateReviewWithVotesPublic | null, Error>>;
}
