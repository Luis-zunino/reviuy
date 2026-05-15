import { Review, ReviewRoom, ReviewRoomUpdate, ReviewUpdate } from '../../domain';
import { RealEstate } from '@/modules/real-estates';

// Review + rooms + real estate
export type ReviewWithRoomsAndRealEstates = Review & {
  review_rooms: ReviewRoom[];
  real_estates: RealEstate | null;
};

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
