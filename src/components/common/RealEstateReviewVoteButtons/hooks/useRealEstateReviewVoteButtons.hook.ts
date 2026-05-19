import {
  useVoteRealEstateReview,
  useGetUserRealEstateReviewVote,
} from '@/modules/real-estates/presentation';
import { VoteType } from '@/types';
import { toast } from 'sonner';
import type { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import type { RealEstateReviewWithVotesPublic } from '@/modules/real-estates';

export interface UseRealEstateReviewVoteButtonsOptions {
  reviewId: string;
  refetchRealEstateReview?: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<RealEstateReviewWithVotesPublic | null, Error>>;
}

export const useRealEstateReviewVoteButtons = (props: UseRealEstateReviewVoteButtonsOptions) => {
  const { reviewId, refetchRealEstateReview } = props;
  const { mutateAsync, isPending } = useVoteRealEstateReview();
  const { data: userVote, refetch } = useGetUserRealEstateReviewVote({ reviewId });

  const handleVote = async (voteType: VoteType) => {
    try {
      await mutateAsync({ reviewId, voteType });
      await refetchRealEstateReview?.();
      await refetch();
    } catch {
      toast.error('Error inesperado', {
        description: 'No se pudo actualizar la reseña. Inténtalo de nuevo.',
      });
    }
  };

  return { handleVote, isPending, userVote: userVote ?? VoteType.NONE };
};
