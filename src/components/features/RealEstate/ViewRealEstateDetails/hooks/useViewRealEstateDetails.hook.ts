import { useAuthContext } from '@/components/providers/AuthProvider';
import { useGetReviewsByRealEstateId } from '@/services';
import { useGetAllRealEstateReviews } from '@/services';
import { useParams } from 'next/navigation';

export const useViewRealEstateDetails = () => {
  const { realEstateId } = useParams<{ realEstateId: string }>();
  const { userId } = useAuthContext();
  const { data, isLoading, error } = useGetAllRealEstateReviews({ id: realEstateId });
  const { data: reviewsData, isLoading: isLoadingReviews } =
    useGetReviewsByRealEstateId(realEstateId);

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
    userId: userId ?? '',
  };
};
