import { RealEstateReviewWithVotesPublic } from '@/modules/real-estates';
import { RealEstateReviewForDelete } from './deleteRealEstateReviewButton.types';

export interface UseDeleteRealEstateReviewButtonProps {
  review: RealEstateReviewWithVotesPublic | RealEstateReviewForDelete;
}
