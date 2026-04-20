import type { RealEstateReview } from '../../domain';

export interface CreateRealEstateReviewResponse {
  success: boolean;
  message: string;
  error?: string;
  data?: RealEstateReview;
}
