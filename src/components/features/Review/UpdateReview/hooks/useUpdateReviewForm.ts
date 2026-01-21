'use client';

import { useGetReviewById } from '@/services/apis/reviews';
import { useCreateOrUpdateReviewForm } from '../../hooks';
import { useParams } from 'next/navigation';

export const useUpdateReviewForm = () => {
  const params = useParams();
  const reviewId = typeof params.id === 'string' ? params.id : '';
  const { data: reviewData, isLoading, error: reviewError } = useGetReviewById({ id: reviewId });

  const props = useCreateOrUpdateReviewForm({
    defaultValues: reviewData,
  });

  return {
    ...props,
    isLoading,
    hasError: reviewError,
    defaultRealEstateId: reviewData?.real_estate_id,
  };
};
