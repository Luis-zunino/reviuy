import type { ReviewInsert, ReviewRoom } from '@/types';

export interface UseCreateReviewParams {
  createData: ReviewInsert & {
    review_rooms?: Omit<ReviewRoom, 'id' | 'review_id' | 'created_at' | 'updated_at'>[];
  };
}

export interface CreateReviewData extends ReviewInsert {
  review_rooms?: Omit<ReviewRoom, 'id' | 'review_id' | 'created_at' | 'updated_at'>[];
}

export interface CreateReviewRequest {
  data: CreateReviewData;
}
