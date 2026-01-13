import type { RealEstateReview } from '@/types';
import type { BaseButtonProps } from '../../types';

export interface ReportRealEstateReviewButtonProps extends BaseButtonProps {
  review?: RealEstateReview | null;
}
