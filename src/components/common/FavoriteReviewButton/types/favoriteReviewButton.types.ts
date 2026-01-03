import type { BaseButtonProps } from '../../types';

export interface FavoriteReviewButtonProps extends BaseButtonProps {
  reviewId: string;
  onClick?: (e: React.MouseEvent) => void;
}
