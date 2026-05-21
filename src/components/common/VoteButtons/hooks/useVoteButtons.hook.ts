'use client';

import { VoteType } from '@/types/vote-type';
import { useOptimistic, useCallback, useState, useRef, useTransition } from 'react';
import { UseVoteButtonsOptions, UseVoteButtonsReturn, VoteState } from './types';
import { handleOptimisticVote } from './utils';

export const useVoteButtons = ({
  likes,
  dislikes,
  userVote,
  onVote,
  onError,
}: UseVoteButtonsOptions): UseVoteButtonsReturn => {
  const [clickedButton, setClickedButton] = useState<VoteType | null>(null);
  const [isPending, startTransition] = useTransition();
  const isPendingRef = useRef(false);

  const initialState: VoteState = {
    likesCount: likes,
    dislikesCount: dislikes,
    currentVote: userVote,
  };

  const [optimisticState, addOptimisticState] = useOptimistic(
    initialState,
    (currentState: VoteState, voteType: VoteType) =>
      handleOptimisticVote({ voteType, currentState })
  );

  const handleVote = useCallback(
    (voteType: VoteType) => {
      if (voteType === VoteType.NONE || isPendingRef.current) return;

      isPendingRef.current = true;

      setClickedButton(voteType);
      const animationTimer = setTimeout(() => setClickedButton(null), 300);

      startTransition(() => {
        (async () => {
          try {
            addOptimisticState(voteType);
            await onVote(voteType);
          } catch (error) {
            clearTimeout(animationTimer);
            onError?.(error instanceof Error ? error : new Error('Vote failed'));
          } finally {
            isPendingRef.current = false;
          }
        })();
      });
    },
    [addOptimisticState, onVote, onError]
  );

  return {
    handleVote,
    clickedButton,
    optimisticLikes: optimisticState.likesCount,
    optimisticDislikes: optimisticState.dislikesCount,
    optimisticUserVote: optimisticState.currentVote,
    isPending,
  };
};
