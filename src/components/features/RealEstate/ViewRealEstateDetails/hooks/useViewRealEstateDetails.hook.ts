import { useAuth } from '@/hooks';
import { useGetReviewsByRealEstateId } from '@/services';
import { useGetAllRealEstateReviews } from '@/services';
import { useParams, useRouter } from 'next/navigation';

export const useViewRealEstateDetails = () => {
  const { realEstateId } = useParams<{ realEstateId: string }>();
  const { user } = useAuth();
  const { data, isLoading, error } = useGetAllRealEstateReviews({ id: realEstateId });
  const { data: reviewsData, isLoading: isLoadingReviews } =
    useGetReviewsByRealEstateId(realEstateId);

  const router = useRouter();
  const calculateAverageRating = () => {
    if (!reviewsData || reviewsData?.length === 0) return 0;
    const sum = reviewsData?.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviewsData?.length;
  };

  return {
    realEstateReview: data,
    isLoadingRealEstateReview: isLoading,
    reviews: reviewsData,
    isLoading,
    error,
    realEstateId,
    averageRating: calculateAverageRating(),
    isLoadingReviews,
    router,
    userId: user?.id,
  };
};
