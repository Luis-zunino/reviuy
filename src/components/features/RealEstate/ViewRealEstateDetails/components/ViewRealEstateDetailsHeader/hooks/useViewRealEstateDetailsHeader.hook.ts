import { useAuthContext } from '@/components/providers/AuthProvider';
import { PagesUrls } from '@/enums';
import {
  useGetRealEstateById,
  useGetRealEstateReviewByUserId,
  useGetUserRealEstateVote,
} from '@/services';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const useViewRealEstateDetailsHeader = () => {
  const { isAuthenticated } = useAuthContext();
  const { realEstateId } = useParams<{ realEstateId: string }>();
  const { push } = useRouter();

  const {
    data: realEstate,
    refetch: refetchRealEstate,
    isLoading,
  } = useGetRealEstateById(realEstateId);
  const { data: hasRealEstateReview } = useGetRealEstateReviewByUserId({
    realEstateId,
  });

  const {
    data: userRealEstateVote,
    refetch: refetchRealEstateVote,
    isLoading: isLoadingVote,
  } = useGetUserRealEstateVote({
    realEstateId,
  });

  const handleOnCreateReview = () => {
    if (!isAuthenticated) {
      toast.warning('Debes iniciar sesión para crear una reseña.');
      return;
    }
    push(PagesUrls.REAL_ESTATE_CREATE_REVIEW.replace(':id', realEstateId));
  };

  return {
    realEstateId,
    realEstate,
    hasRealEstateReview,
    userRealEstateVote,
    refetchRealEstate,
    refetchRealEstateVote,
    isLoading,
    isLoadingVote,
    handleOnCreateReview,
  };
};

export default useViewRealEstateDetailsHeader;
