'use client';

import { useUpdateReviewForm } from './hooks';
import { ReviewForm } from '../components/ReviewForm';

export const UpdateReview = () => {
  const props = useUpdateReviewForm();

  return <ReviewForm {...props} />;
};
