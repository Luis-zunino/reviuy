import type { BaseButtonProps } from '../../types';

export interface EditReviewButtonProps extends BaseButtonProps {
  review: {
    id: string;
    user_id?: string;
  };
}
