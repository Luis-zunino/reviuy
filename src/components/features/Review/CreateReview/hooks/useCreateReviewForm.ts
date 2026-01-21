'use client';

import { useCreateOrUpdateReviewForm } from '../../hooks';

export const useCreateReviewForm = () => {
  return useCreateOrUpdateReviewForm({
    defaultValues: null,
  });
};
