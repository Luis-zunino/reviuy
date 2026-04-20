import type { CreatePropertyReviewInput, ReviewRoom } from '@/modules/property-reviews';

export interface UseCreateReviewParams {
  createData: CreatePropertyReviewInput & {
    review_rooms?: Omit<ReviewRoom, 'id' | 'review_id' | 'created_at' | 'updated_at'>[];
  };
}

export interface CreateReviewData extends CreatePropertyReviewInput {
  review_rooms?: Omit<ReviewRoom, 'id' | 'review_id' | 'created_at' | 'updated_at'>[];
}

export interface CreateReviewRequest {
  data: CreateReviewData;
}
