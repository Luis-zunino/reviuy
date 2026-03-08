import { RealEstateReviewWithVotesPublic } from '@/types';
import { RealEstateReviewForDelete } from './deleteRealEstateReviewButton.types';

export interface UseDeleteRealEstateReviewButtonProps {
  review: RealEstateReviewWithVotesPublic | RealEstateReviewForDelete;
}
