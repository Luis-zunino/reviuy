import { RealEstateReview } from '@/types';
import { RealEstateReviewForDelete } from './deleteRealEstateReviewButton.types';

export interface UseDeleteRealEstateReviewButtonProps {
  review: RealEstateReview | RealEstateReviewForDelete;
  onDeleteSuccess?: () => void;
}
