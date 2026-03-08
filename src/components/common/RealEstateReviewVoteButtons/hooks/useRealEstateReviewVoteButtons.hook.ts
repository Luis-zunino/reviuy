import { useVoteRealEstateReview } from '@/services';
import { RealEstateReviewWithVotesPublic, VoteType } from '@/types';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

export interface RealEstateReviewVoteButtonsProps {
  reviewId: string;
  userVote?: VoteType | null;
  refetchRealEstateReview:
    | ((
        options?: RefetchOptions | undefined
      ) => Promise<QueryObserverResult<RealEstateReviewWithVotesPublic | null, Error>>)
    | undefined;
}

export const useRealEstateReviewVoteButtons = (props: RealEstateReviewVoteButtonsProps) => {
  const { reviewId, userVote, refetchRealEstateReview } = props;
  const { mutateAsync, isPending } = useVoteRealEstateReview();
  const [clickedButton, setClickedButton] = useState<VoteType | null>(null);

  const handleVote = async (voteType: VoteType) => {
    setClickedButton(voteType);
    setTimeout(() => setClickedButton(null), 300);

    await mutateAsync(
      { reviewId, voteType },
      {
        onSuccess: () => {
          return refetchRealEstateReview?.();
        },

        onError: () => {
          toast.error('Error inesperado', {
            description: 'No se pudo actualizar la reseña. Inténtalo de nuevo.',
          });
        },
      }
    );
  };

  const getLikeTooltip = () => {
    if (userVote === VoteType.LIKE) return 'Ya votaste útil';
    return 'Marcar como útil';
  };

  const getDislikeTooltip = () => {
    if (userVote === VoteType.DISLIKE) return 'Ya votaste no útil';
    return 'Marcar como no útil';
  };
  return { handleVote, isPending, clickedButton, getLikeTooltip, getDislikeTooltip };
};
