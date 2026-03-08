import type { ReviewRoom } from '@/types';
import type { CreateReviewData as ActionCreateReviewData } from '@/app/_actions/types/review.types';

export interface UseCreateReviewParams {
  createData: ActionCreateReviewData & {
    review_rooms?: Omit<ReviewRoom, 'id' | 'review_id' | 'created_at' | 'updated_at'>[];
  };
}

export interface CreateReviewData extends ActionCreateReviewData {
  review_rooms?: Omit<ReviewRoom, 'id' | 'review_id' | 'created_at' | 'updated_at'>[];
}

export interface CreateReviewRequest {
  data: CreateReviewData;
}
