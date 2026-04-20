import { Review, ReviewRoom } from '../../domain';

export interface CreateReviewResponse {
  success: boolean;
  message: string;
  error?: string;
  data?: Review & { review_rooms?: ReviewRoom[] };
}
