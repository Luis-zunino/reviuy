import { useGetReviewsByRealEstateId } from '@/modules/property-reviews';
import { useGetAllRealEstateReviews } from '@/modules/real-estates';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';

export const useViewRealEstateDetails = () => {
  const { realEstateId } = useParams<{ realEstateId: string }>();
  const { data, isLoading, error } = useGetAllRealEstateReviews({ id: realEstateId });
  const { data: reviewsData, isLoading: isLoadingReviews } =
    useGetReviewsByRealEstateId(realEstateId);

  const averageRating = useMemo(() => {
    if (!data?.length) return 0;

    const validReviews = data.filter(
      (review) => review?.rating != null && typeof review.rating === 'number'
    );

    if (validReviews.length === 0) return 0;

    const sum = validReviews.reduce((acc, review) => acc + (review.rating ?? 0), 0);
    const average = sum / validReviews.length;

    return Math.round(average * 10) / 10;
  }, [data]);

  return {
    realEstateReview: data,
    isLoadingRealEstateReview: isLoading,
    reviews: reviewsData,
    isLoading,
    error,
    realEstateId,
    averageRating,
    isLoadingReviews,
  };
};
