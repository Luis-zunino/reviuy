import { useAuthContext } from '@/components/providers/AuthProvider';
import {
  useGetRealEstateById,
  useGetRealEstateReviewByUserId,
  useGetUserRealEstateVote,
} from '@/services';
import { useParams } from 'next/navigation';

export const useViewRealEstateDetailsHeader = () => {
  const { userId } = useAuthContext();
  const { realEstateId } = useParams<{ realEstateId: string }>();
  const {
    data: realEstate,
    refetch: refetchRealEstate,
    isLoading,
  } = useGetRealEstateById(realEstateId);
  const { data: hasRealEstateReview } = useGetRealEstateReviewByUserId({
    userId: userId ?? '',
    realEstateId,
  });

  const {
    data: userRealEstateVote,
    refetch: refetchRealEstateVote,
    isLoading: isLoadingVote,
  } = useGetUserRealEstateVote({
    realEstateId,
    userId: userId ?? '',
  });

  return {
    realEstateId,
    realEstate,
    hasRealEstateReview,
    userRealEstateVote,
    refetchRealEstate,
    refetchRealEstateVote,
    isLoading,
    isLoadingVote,
  };
};

export default useViewRealEstateDetailsHeader;
