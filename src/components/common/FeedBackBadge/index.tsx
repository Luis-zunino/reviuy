import { ThumbsDown, ThumbsUp } from 'lucide-react';
import type { FeedBackBadgeProps } from './types';
import { Badge } from '@/components/ui/badge';

export const FeedBackBadge = (props: FeedBackBadgeProps) => {
  const { recommended } = props;
  return (
    <div className="lg:flex items-center lg:py-4 lg:px-6 w-full lg:justify-between grid grid-rows">
      <Badge
        variant={recommended ? 'default' : 'destructive'}
        className="flex items-center gap-1.5 w-fit text-xs font-semibold px-4 mx-4 py-2 shrink-0  uppercase"
      >
        {recommended ? (
          <>
            <ThumbsUp className="h-3 w-3" />
            Recomiendo
          </>
        ) : (
          <>
            <ThumbsDown className="h-3 w-3" />
            No recomiendo
          </>
        )}
      </Badge>
    </div>
  );
};
