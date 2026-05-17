import { UseVoteButtonsOptions } from '../hooks/types';

export interface VoteButtonsProps extends UseVoteButtonsOptions {
  className?: string;
  label?: string;
  disabled?: boolean;
  likeTooltip?: string;
  likeTooltipActive?: string;
  dislikeTooltip?: string;
  dislikeTooltipActive?: string;
}
