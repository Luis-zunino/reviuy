import type { BaseButtonProps } from '../../types';

export interface EditReviewButtonProps extends BaseButtonProps {
  review: {
    id: string | null;
    user_id?: string | null;
  };
}
