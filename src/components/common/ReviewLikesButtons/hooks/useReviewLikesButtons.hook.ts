import { useQueryClient } from '@tanstack/react-query';
import { useGetReviewVote } from '@/modules/property-reviews/presentation';
import { REVIEW_KEYS } from '@/constants';
import { voteAction } from '../../VoteButtons/actions';
import { VoteType } from '@/types';
import { toast } from 'sonner';
import { usePathname } from 'next/navigation';
import { useState, useRef } from 'react';

export const useReviewLikesButtons = (props: { id: string }) => {
  const { id: reviewId } = props;
  const path = usePathname();
  const queryClient = useQueryClient();
  const { data, refetch } = useGetReviewVote({ reviewId });

  const [isPending, setIsPending] = useState(false);
  const isPendingRef = useRef(false);

  const addVote = async (voteType: VoteType) => {
    if (isPendingRef.current) return;
    isPendingRef.current = true;
    setIsPending(true);

    try {
      await voteAction(reviewId, voteType, path);
      await refetch();
      await queryClient.invalidateQueries({ queryKey: [REVIEW_KEYS.getReviewById, reviewId] });
    } catch (error) {
      toast.warning(error instanceof Error ? error.message : 'Vote failed');
    } finally {
      isPendingRef.current = false;
      setIsPending(false);
    }
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
    userVote: data ?? VoteType.NONE,
    isPending,
  };
};
