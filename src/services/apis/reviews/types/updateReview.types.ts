import type { ReviewWithRoomsAndRealEstates, ReviewUpdate, ReviewRoomUpdate } from '@/types';

export interface UpdateReviewResponse {
  success: boolean;
  message: string;
  error?: string;
  data?: ReviewWithRoomsAndRealEstates;
}

export interface UpdateReviewApiRequest {
  reviewId: string;
  updateData: ReviewUpdate & { review_rooms?: ReviewRoomUpdate[] };
  user_id?: string;
}
