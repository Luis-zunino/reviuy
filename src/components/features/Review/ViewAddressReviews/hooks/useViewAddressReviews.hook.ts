import { PagesUrls } from '@/enums';
import { useGetAddressInfo, useGetReviewsByAddress } from '@/services';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useParams } from 'next/navigation';
import { useAuthContext } from '@/components/providers/AuthProvider';

export const useViewAddressReviews = () => {
  const { osmId } = useParams<{ osmId: string }>();
  const router = useRouter();
  const { isAuthenticated } = useAuthContext();
  const {
    data: addressData,
    isLoading: isLoadingAddress,
    error: addressError,
    isError,
  } = useGetAddressInfo({ osmId });
  const {
    data: reviews,
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

    const hasExistingReview = reviews?.some((review) => review.is_mine);

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
    reviews && reviews.length > 0
      ? reviews.reduce((acc, review) => acc + (review.rating || 0), 0) / reviews.length
      : 0;

  return {
    data: addressData?.[0],
    reviews,
    isLoading,
    isError: isError || isErrorReviews,
    handleCreateReview,
    averageRating,
  };
};
