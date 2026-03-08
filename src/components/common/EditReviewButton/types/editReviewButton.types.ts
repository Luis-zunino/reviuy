import type { BaseButtonProps } from '../../types';

export interface EditReviewButtonProps extends BaseButtonProps {
  review: {
    id: string | null;
    is_mine: boolean | null;
  };
}
