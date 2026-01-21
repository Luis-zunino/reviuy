'use client';

import { useCreateReviewForm } from './hooks';
import { ReviewForm } from '../components/ReviewForm';

export const CreateReview = () => {
  const props = useCreateReviewForm();

  return <ReviewForm {...props} />;
};
