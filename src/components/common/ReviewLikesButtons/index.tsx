'use client';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { VoteType } from '@/types';
import { Loader2, ThumbsDown, ThumbsUp } from 'lucide-react';
import React from 'react';
import { cn } from '@/lib/utils';
import { useReviewLikesButtons } from './hooks';
import type { ReviewLikesButtonsProps } from './types';

export const ReviewLikesButtons = (props: ReviewLikesButtonsProps) => {
  const { id, likes, dislikes, className } = props;
  const {
    addVote,
    getLikeTooltip,
    getDislikeTooltip,
    isVoting,
    clickedButton,
    optimisticLikes,
    optimisticDislikes,
    userVoteType,
    userVoteTypeIsLoading,
  } = useReviewLikesButtons({ id, likes, dislikes });

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex flex-col items-center gap-1 text-center">
        <span className="text-xs text-gray-500">¿Te fue útil?</span>

        {isVoting || userVoteTypeIsLoading ? (
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
        ) : (
          <div className={cn('flex items-center gap-2', className)}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="like"
                  data-active={userVoteType === VoteType.LIKE}
                  size="sm"
                  onClick={() =>
                    addVote({
                      id,
                      voteType: VoteType.LIKE,
                    })
                  }
                  icon={ThumbsUp}
                  className={cn(
                    'min-w-12 h-10 rounded-lg transition-all duration-200',
                    'hover:scale-105 active:scale-95',
                    clickedButton === VoteType.LIKE && 'animate-pulse'
                  )}
                  aria-label="Marcar como útil"
                >
                  {optimisticLikes}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{getLikeTooltip()}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="like"
                  data-active={userVoteType === VoteType.DISLIKE}
                  size="sm"
                  onClick={() =>
                    addVote({
                      id,
                      voteType: VoteType.DISLIKE,
                    })
                  }
                  icon={ThumbsDown}
                  className={cn(
                    'min-w-12 h-10 rounded-lg transition-all duration-200',
                    'hover:scale-105 active:scale-95',
                    clickedButton === VoteType.DISLIKE && 'animate-pulse'
                  )}
                  aria-label="Marcar como no útil"
                >
                  {optimisticDislikes}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{getDislikeTooltip()}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};
