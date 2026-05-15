'use client';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Loader2, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useRealEstateReviewVoteButtons } from './hooks';
import { VoteType } from '@/types';
import { cn } from '@/lib/utils';
import type { RealEstateReviewVoteButtonsProps } from './types';

export const RealEstateReviewVoteButtons: React.FC<RealEstateReviewVoteButtonsProps> = ({
  reviewId,
  likes,
  dislikes,
  userVote,
  className = '',
  refetchRealEstateReview,
}) => {
  const { handleVote, isPending, clickedButton, getLikeTooltip, getDislikeTooltip } =
    useRealEstateReviewVoteButtons({
      reviewId,
      userVote,
      refetchRealEstateReview,
    });

  return (
    <TooltipProvider delayDuration={300}>
      <div className={cn('flex items-center gap-2', className)}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="like"
              size="sm"
              onClick={() => handleVote(VoteType.LIKE)}
              disabled={isPending}
              data-active={userVote === VoteType.LIKE}
              icon={ThumbsUp}
              className={cn(
                'min-w-12 transition-all duration-200',
                'hover:scale-105 active:scale-95',
                clickedButton === VoteType.LIKE && 'animate-pulse',
                userVote === VoteType.LIKE &&
                  'bg-green-100 border-green-500 text-green-700 hover:bg-green-200'
              )}
              aria-label="Marcar como útil"
            >
              {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <span>{likes}</span>}
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
              size="sm"
              onClick={() => handleVote(VoteType.DISLIKE)}
              disabled={isPending}
              data-active={userVote === VoteType.DISLIKE}
              icon={ThumbsDown}
              className={cn(
                'min-w-12 transition-all duration-200',
                'hover:scale-105 active:scale-95',
                clickedButton === VoteType.DISLIKE && 'animate-pulse',
                userVote === VoteType.DISLIKE &&
                  'bg-red-100 border-red-500 text-red-700 hover:bg-red-200'
              )}
              aria-label="Marcar como no útil"
            >
              {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <span>{dislikes}</span>}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{getDislikeTooltip()}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};
