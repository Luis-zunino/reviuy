import { RealEstateReviewWithVotesPublic } from '@/modules/real-estates';
import type { BaseButtonProps } from '../../types';

export interface ReportRealEstateReviewButtonProps extends BaseButtonProps {
  review?: RealEstateReviewWithVotesPublic | null;
}
