import { useQueryClient } from '@tanstack/react-query';
import { useGetReviewVote, voteReviewAction } from '@/modules/property-reviews/presentation';
import { REVIEW_KEYS } from '@/constants/query-keys.constant';
import { VoteType } from '@/types/vote-type';
import { toast } from 'sonner';
import { usePathname } from 'next/navigation';
import { useRef, useTransition } from 'react';

export const useReviewLikesButtons = (props: { id: string }) => {
  const { id: reviewId } = props;
  const path = usePathname();
  const queryClient = useQueryClient();
  const { data, refetch } = useGetReviewVote({ reviewId });

  const [isPending, startTransition] = useTransition();
  const isPendingRef = useRef(false);

  const addVote = async (voteType: VoteType) => {
    if (isPendingRef.current) return;
    isPendingRef.current = true;

    startTransition(async () => {
      try {
        await voteReviewAction(reviewId, voteType, path);
        await Promise.all([
          refetch(),
          queryClient.invalidateQueries({ queryKey: [REVIEW_KEYS.getReviewById, reviewId] }),
        ]);
      } catch (error) {
        toast.warning(error instanceof Error ? error.message : 'Vote failed');
      } finally {
        isPendingRef.current = false;
      }
    });
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
