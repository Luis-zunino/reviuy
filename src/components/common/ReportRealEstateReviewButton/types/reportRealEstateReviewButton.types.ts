import type { RealEstateReviewWithVotesPublic } from '@/types';
import type { BaseButtonProps } from '../../types';

export interface ReportRealEstateReviewButtonProps extends BaseButtonProps {
  review?: RealEstateReviewWithVotesPublic | null;
}
