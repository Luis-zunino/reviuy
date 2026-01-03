import type { ReviewInsert, ReviewRoom } from '@/types';

export interface UseCreateReviewParams {
  createData: ReviewInsert & {
    review_rooms?: Omit<ReviewRoom, 'id' | 'review_id' | 'created_at' | 'updated_at'>[];
  };
}
