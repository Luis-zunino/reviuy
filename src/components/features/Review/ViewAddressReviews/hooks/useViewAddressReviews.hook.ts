import { PagesUrls } from '@/enums';
import { useUser } from '@/hooks';
import { useGetAddressInfo, useGetReviewsByAddress } from '@/services';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useParams } from 'next/navigation';

export const useViewAddressReviews = () => {
  const { osmId } = useParams<{ osmId: string }>();
  const router = useRouter();
  const { isAuthenticated, user } = useUser();
  const {
    data: addressData,
    isLoading: isLoadingAddress,
    error: addressError,
    isError,
  } = useGetAddressInfo({ osmId });
  const {
    data: reviewsData,
    isLoading: isLoadingReviews,
    error: reviewsError,
    isError: isErrorReviews,
  } = useGetReviewsByAddress({ osmId });

  if (addressError) {
    toast.error('Error fetching address');
  }

  if (reviewsError) {
    toast.error('Error fetching reviews');
  }

  const isLoading = isLoadingAddress || isLoadingReviews;

  const handleCreateReview = () => {
    if (!isAuthenticated) {
      router.push(PagesUrls.LOGIN);
      return;
    }

    const hasExistingReview = reviewsData?.some((review) => review.user_id === user?.id);

    if (hasExistingReview) {
      toast.warning('Ya has reseñado esta propiedad', {
        description:
          'Solo puedes escribir una reseña por propiedad. Puedes editar tu reseña existente desde tu perfil.',
      });
      return;
    }

    router.push(PagesUrls.REVIEW_CREATE);
  };

  const averageRating =
    reviewsData && reviewsData.length > 0
      ? reviewsData.reduce((acc, review) => acc + (review.rating || 0), 0) / reviewsData.length
      : 0;

  return {
    data: addressData?.[0],
    reviews: reviewsData || [],
    isLoading,
    isError: isError || isErrorReviews,
    hasReviews: (reviewsData?.length || 0) > 0,
    handleCreateReview,
    averageRating,
  };
};
