import type { UseFormReturn } from 'react-hook-form';
import type { RealEstateReview, RealEstateReviewUpdate } from '@/types';
import type { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';

export interface RealEstateReviewFormProps<RR extends RealEstateReviewUpdate> {
  form: UseFormReturn<RR, undefined, RR>;
  handleSubmit: (formData: RR) => Promise<void>;
  isSubmitting: boolean;
  title: string;
  subtitle?: string;
  isLoading: boolean;
  error: boolean;
  isReadOnly?: boolean;
  review?: RealEstateReview | null;
  refetchRealEstateReview?: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<RealEstateReview | null, Error>>;
}
