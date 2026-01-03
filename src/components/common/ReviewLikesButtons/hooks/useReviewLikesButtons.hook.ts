import { PagesUrls } from '@/enums';
import { useAuth } from '@/hooks';
import { useGetReviewVote, useVoteReview } from '@/services';
import { VoteType } from '@/types';
import { redirect } from 'next/navigation';
import { useState } from 'react';
import type { ReviewLikesButtonsProps } from '../types';
import type { AddVoteParams } from './types';

export const useReviewLikesButtons = (props: ReviewLikesButtonsProps) => {
  const { id, likes: initialLikes, dislikes: initialDislikes } = props;
  const { user } = useAuth();
  const { mutateAsync, isPending: isVoting, isError } = useVoteReview();
  const { data, isLoading, refetch } = useGetReviewVote({
    reviewId: id,
    userId: user?.id || '',
  });
  // Estado para animaciones
  const [clickedButton, setClickedButton] = useState<VoteType | null>(null);

  // Estado local optimista para likes/dislikes
  const [optimisticLikes, setOptimisticLikes] = useState(initialLikes);
  const [optimisticDislikes, setOptimisticDislikes] = useState(initialDislikes);

  const addVote = async ({ id, voteType }: AddVoteParams) => {
    if (!user?.id) redirect(PagesUrls.LOGIN);

    // Trigger animación
    setClickedButton(voteType);
    setTimeout(() => setClickedButton(null), 300);

    // Guardar estado previo para rollback en caso de error
    const previousLikes = optimisticLikes;
    const previousDislikes = optimisticDislikes;

    // Optimistic update
    if (voteType === VoteType.LIKE) {
      if (data === VoteType.LIKE) {
        // Si ya dio like, lo quita
        setOptimisticLikes((prev) => prev - 1);
      } else if (data === VoteType.DISLIKE) {
        // Si tenía dislike, lo cambia a like
        setOptimisticDislikes((prev) => prev - 1);
        setOptimisticLikes((prev) => prev + 1);
      } else {
        // Si no tenía voto, agrega like
        setOptimisticLikes((prev) => prev + 1);
      }
    } else {
      // VoteType.DISLIKE
      if (data === VoteType.DISLIKE) {
        // Si ya dio dislike, lo quita
        setOptimisticDislikes((prev) => prev - 1);
      } else if (data === VoteType.LIKE) {
        // Si tenía like, lo cambia a dislike
        setOptimisticLikes((prev) => prev - 1);
        setOptimisticDislikes((prev) => prev + 1);
      } else {
        // Si no tenía voto, agrega dislike
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
