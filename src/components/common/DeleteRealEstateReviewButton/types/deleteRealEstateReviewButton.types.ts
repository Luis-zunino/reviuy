import type { RealEstateReviewWithVotes } from '@/types';
import type { BaseButtonProps } from '../../types';

// Tipo que incluye los campos mínimos necesarios para eliminar una reseña
export type RealEstateReviewForDelete = {
  id: string;
  user_id?: string;
  title: string;
};

export interface DeleteRealEstateReviewButtonProps extends BaseButtonProps {
  review: RealEstateReviewWithVotes | RealEstateReviewForDelete;
}
