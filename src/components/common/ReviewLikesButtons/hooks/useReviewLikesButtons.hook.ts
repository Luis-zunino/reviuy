import { PagesUrls } from '@/enums';
import { useGetReviewVote, useVoteReview } from '@/services';
import { VoteType } from '@/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { ReviewLikesButtonsProps } from '../types';
import type { AddVoteParams } from './types';
import { useAuthContext } from '@/components/providers/AuthProvider';

export const useReviewLikesButtons = (props: ReviewLikesButtonsProps) => {
  const { id, likes: initialLikes, dislikes: initialDislikes } = props;
  const { userId } = useAuthContext();
  const { push } = useRouter();

  const { mutateAsync, isPending: isVoting, isError } = useVoteReview();
  const { data, isLoading, refetch } = useGetReviewVote({
    reviewId: id,
    userId: userId || '',
  });
  const [clickedButton, setClickedButton] = useState<VoteType | null>(null);

  const [optimisticLikes, setOptimisticLikes] = useState(initialLikes);
  const [optimisticDislikes, setOptimisticDislikes] = useState(initialDislikes);

  const addVote = async ({ id, voteType }: AddVoteParams) => {
    if (!userId) push(PagesUrls.LOGIN);

    setClickedButton(voteType);
    setTimeout(() => setClickedButton(null), 300);

    const previousLikes = optimisticLikes;
    const previousDislikes = optimisticDislikes;

    if (voteType === VoteType.LIKE) {
      if (data === VoteType.LIKE) {
        setOptimisticLikes((prev) => prev - 1);
      } else if (data === VoteType.DISLIKE) {
        setOptimisticDislikes((prev) => prev - 1);
        setOptimisticLikes((prev) => prev + 1);
      } else {
        setOptimisticLikes((prev) => prev + 1);
      }
    } else {
      if (data === VoteType.DISLIKE) {
        setOptimisticDislikes((prev) => prev - 1);
      } else if (data === VoteType.LIKE) {
        setOptimisticLikes((prev) => prev - 1);
        setOptimisticDislikes((prev) => prev + 1);
      } else {
        setOptimisticDislikes((prev) => prev + 1);
      }
    }

    await mutateAsync({ reviewId: id, voteType });

    if (isError) {
      setOptimisticLikes(previousLikes);
      setOptimisticDislikes(previousDislikes);
    }
    refetch();
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
