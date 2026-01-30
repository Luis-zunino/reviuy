import type { ReviewWithVotes } from '@/types';
import type { BaseButtonProps } from '../../types';

// Tipo que incluye los campos mínimos necesarios para eliminar una reseña
export type ReviewForDelete = {
  id: string;
  user_id?: string;
  title: string;
};

export interface DeleteReviewButtonProps extends BaseButtonProps {
  review: ReviewWithVotes | ReviewForDelete;
}
