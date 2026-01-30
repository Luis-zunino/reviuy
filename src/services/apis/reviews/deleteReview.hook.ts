'use client';

import { deleteReview } from './deleteReview.api';

import { useAuthMutation } from '../user';

export const useDeleteReview = () => {
  return useAuthMutation({
    mutationFn: deleteReview,
  });
};
