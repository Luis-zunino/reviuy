import { ReviewWithVotesPublic } from '@/modules/property-reviews';
import type { BaseButtonProps } from '../../types';

export interface ReportReviewButtonProps extends BaseButtonProps {
  review: ReviewWithVotesPublic;
}
