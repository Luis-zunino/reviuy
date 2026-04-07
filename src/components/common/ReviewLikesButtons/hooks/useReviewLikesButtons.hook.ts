import { useGetReviewVote, useVoteReview } from '@/modules/property-reviews/presentation';
import { VoteType } from '@/types';
import { useState } from 'react';
import type { ReviewLikesButtonsProps } from '../types';
import type { AddVoteParams } from './types';
import { toast } from 'sonner';

export const useReviewLikesButtons = (props: ReviewLikesButtonsProps) => {
  const { id, likes: initialLikes, dislikes: initialDislikes } = props;

  const { mutateAsync, isPending: isVoting } = useVoteReview();
  const { data, isLoading, refetch } = useGetReviewVote({
    reviewId: id,
  });
  const [clickedButton, setClickedButton] = useState<VoteType | null>(null);

  const [optimisticLikes, setOptimisticLikes] = useState(initialLikes);
  const [optimisticDislikes, setOptimisticDislikes] = useState(initialDislikes);

  const addVote = async ({ id, voteType }: AddVoteParams) => {
    setClickedButton(voteType);
    setTimeout(() => setClickedButton(null), 300);

    if (voteType === VoteType.LIKE) {
      if (data === VoteType.LIKE) {
        setOptimisticLikes((prev) => prev - 1);
      } else if (data === VoteType.DISLIKE) {
        setOptimisticDislikes((prev) => prev - 1);
        setOptimisticLikes((prev) => prev + 1);
      } else {
        setOptimisticLikes((prev) => prev + 1);
      }
    }

    if (data === VoteType.DISLIKE) {
      setOptimisticDislikes((prev) => prev - 1);
    } else if (data === VoteType.LIKE) {
      setOptimisticLikes((prev) => prev - 1);
      setOptimisticDislikes((prev) => prev + 1);
    } else {
      setOptimisticDislikes((prev) => prev + 1);
    }

    await mutateAsync(
      { reviewId: id, voteType },
      {
        onError: (error: Error) => {
          setOptimisticLikes(initialLikes);
          setOptimisticDislikes(initialDislikes);
          toast.warning(error.message);
        },
      }
    );

    await refetch();
  };

  const getLikeTooltip = () => {
    if (data === VoteType.LIKE) return 'Ya votaste útil';
    return 'Marcar como útil';
  };

  const getDislikeTooltip = () => {
    if (data === VoteType.DISLIKE) return 'Ya votaste no útil';
    return 'Marcar como no útil';
  };

  return {
    addVote,
    getLikeTooltip,
    getDislikeTooltip,
    isVoting,
    clickedButton,
    optimisticLikes,
    optimisticDislikes,
    userVoteType: data ?? VoteType.NONE,
    userVoteTypeIsLoading: isLoading,
  };
};
