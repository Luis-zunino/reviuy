import type { ReviewWithVotesPublic } from '@/types';
import type { BaseButtonProps } from '../../types';

export interface ReportReviewButtonProps extends BaseButtonProps {
  review: ReviewWithVotesPublic;
}
