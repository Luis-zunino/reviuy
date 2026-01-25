'use client';

import { useUpdateReviewForm } from './hooks';
import { ReviewForm } from '../components/ReviewForm';

export const UpdateReview = () => {
  const { handleSubmit, ...props } = useUpdateReviewForm();

  return <ReviewForm handleSubmit={handleSubmit} {...props} />;
};
