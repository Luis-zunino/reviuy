import type { RealEstateReview } from '@/types';

export interface UpdateRealEstateReviewResponse {
  success: boolean;
  message: string;
  error?: string;
  data?: RealEstateReview;
}

export interface RealEstateReviewUpdate {
  id: string;
  rating?: number;
  comment?: string;
}
