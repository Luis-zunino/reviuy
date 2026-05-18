import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

export interface VoteButtonProps {
  handleOnClick: () => void;
  disabled?: boolean;
  isActive: boolean;
  icon: LucideIcon | undefined;
  clickedButton: boolean;
  toolTipMessage: string;
  optimisticVotes: number;
}

export const VoteButton = (props: VoteButtonProps) => {
  const {
    handleOnClick,
    disabled,
    isActive,
    icon,
    clickedButton,
    toolTipMessage,
    optimisticVotes,
  } = props;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="like"
          size="sm"
          onClick={handleOnClick}
          disabled={disabled}
          data-active={isActive}
          icon={icon}
          className={cn(
            'min-w-12 h-10 rounded-lg transition-all duration-200',
            'hover:scale-105 active:scale-95',
            clickedButton && 'animate-pulse'
          )}
          aria-label={toolTipMessage}
        >
          {optimisticVotes}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{toolTipMessage}</p>
      </TooltipContent>
    </Tooltip>
  );
};
