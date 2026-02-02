import type { RealEstateReview } from '@/types';

export interface UpdateRealEstateReviewResponse {
  success: boolean;
  message: string;
  error?: string;
  data?: RealEstateReview;
}

export interface UseRealEstateReviewUpdate {
  id: string;
  title: string;
  rating: number;
  description: string;
}
