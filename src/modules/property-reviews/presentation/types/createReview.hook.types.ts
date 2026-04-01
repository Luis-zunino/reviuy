import type {
  CreatePropertyReviewInput as ActionCreateReviewData,
  ReviewRoom,
} from '@/modules/property-reviews';

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
