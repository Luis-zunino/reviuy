'use client';

import { VoteButtons } from '../VoteButtons';
import { useRealEstateVoteButtons } from './hooks';
import type { RealEstateVoteButtonsProps } from './types';

export const RealEstateVoteButtons: React.FC<RealEstateVoteButtonsProps> = (props) => {
  const { realEstateId, likes, dislikes, userVote, className, refetchRealEstate, isLoading } =
    props;
  const { handleVote, isPending } = useRealEstateVoteButtons({
    realEstateId,
    refetchRealEstate,
  });

  return (
    <VoteButtons
      likes={likes}
      dislikes={dislikes}
      userVote={userVote}
      onVote={handleVote}
      disabled={isPending || isLoading}
      className={className}
      likeTooltip="Recomendar esta inmobiliaria"
      likeTooltipActive="Ya recomendaste esta inmobiliaria"
      dislikeTooltip="No recomendar esta inmobiliaria"
      dislikeTooltipActive="Ya marcaste que no la recomiendas"
    />
  );
};
