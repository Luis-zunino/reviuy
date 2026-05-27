import { PagesUrls } from '@/enums/pagesUrls.enum';
import { useGetAddressInfo } from '@/modules/addresses/presentation';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import { useAuthContext } from '@/components/providers/AuthProvider';
import { useGetReviewsByAddress } from '@/modules/property-reviews';

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
    error: reviewsError,
    isError: isErrorReviews,
  } = useGetReviewsByAddress({ osmId });

  if (addressError) {
    toast.error('Error fetching address');
  }

  if (reviewsError) {
    toast.error(reviewsError.message);
  }

  // Page-level loading only depends on address data.
  // Reviews load independently — the component already handles empty/null reviews.
  const isLoading = isLoadingAddress;

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
    /** Address-specific error — use for page-level error state */
    isAddressError: isError,
    handleCreateReview,
    averageRating,
  };
};
