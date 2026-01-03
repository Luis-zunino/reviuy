import type { ReviewRoom, Review } from '@/types';

export interface CreateReviewResponse {
  success: boolean;
  message: string;
  error?: string;
  data?: Review & { review_rooms?: ReviewRoom[] };
}
