import type { RealEstateReviewWithVotes } from '@/types';
import type { BaseButtonProps } from '../../types';

export interface ReportRealEstateReviewButtonProps extends BaseButtonProps {
  review?: RealEstateReviewWithVotes | null;
}
