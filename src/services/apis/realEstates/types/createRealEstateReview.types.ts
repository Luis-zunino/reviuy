import type { RealEstateReview } from '@/types';

export interface CreateRealEstateReviewResponse {
  success: boolean;
  message: string;
  error?: string;
  data?: RealEstateReview;
}
