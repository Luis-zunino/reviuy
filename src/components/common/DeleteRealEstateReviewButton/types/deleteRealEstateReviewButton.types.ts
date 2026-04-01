import type { RealEstateReviewWithVotesPublic } from '@/modules/real-estates';
import type { BaseButtonProps } from '../../types';

// Tipo que incluye los campos mínimos necesarios para eliminar una reseña
export type RealEstateReviewForDelete = {
  id: string;
  is_mine: boolean;
  title: string;
};

export interface DeleteRealEstateReviewButtonProps extends BaseButtonProps {
  review: RealEstateReviewWithVotesPublic | RealEstateReviewForDelete;
}
