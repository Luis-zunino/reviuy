import type { ReviewWithVotesPublic } from '@/types';
import type { BaseButtonProps } from '../../types';

// Tipo que incluye los campos mínimos necesarios para eliminar una reseña
export type ReviewForDelete = {
  id: string;
  is_mine: boolean;
  title: string;
};

export interface DeleteReviewButtonProps extends BaseButtonProps {
  review: ReviewWithVotesPublic | ReviewForDelete;
}
