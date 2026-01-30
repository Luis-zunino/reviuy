import { RealEstateReviewWithVotes } from '@/types';
import { RealEstateReviewForDelete } from './deleteRealEstateReviewButton.types';

export interface UseDeleteRealEstateReviewButtonProps {
  review: RealEstateReviewWithVotes | RealEstateReviewForDelete;
}
