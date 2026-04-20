'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FeedBackBadge, StarRatingDisplay } from '@/components/common';
import { Separator } from '@/components/ui/separator';
import { PagesUrls } from '@/enums';
import type { AddressReviewCardProps } from './types';

export const AddressReviewCard = ({ review }: AddressReviewCardProps) => {
  const router = useRouter();
  const recommended = (review.rating ?? 0) >= 3.5;

  const daysSinceCreated = Math.floor(
    (new Date().getTime() - new Date(review.created_at ?? '').getTime()) / (1000 * 60 * 60 * 24)
  );

  const handleViewMore = () => {
    router.push(`${PagesUrls.REVIEW_DETAILS.replace(':id', review.id ?? '')}`);
  };

  return (
    <Card className="h-72 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col">
      <FeedBackBadge recommended={recommended} />
      <div className="p-4 pb-0 flex flex-col gap-3 flex-1 min-h-0">
        <div className="flex-1 min-w-0 w-full overflow-auto">
          <h3 className="text-sm font-semibold text-foreground mb-1 line-clamp-1">
            {review.title}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {review.description}
          </p>
        </div>
        <StarRatingDisplay rating={review.rating ?? 0} />
        <Separator className="shrink-0" />
        <div className="flex justify-between align-middle w-full shrink-0">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span className="text-xs text-muted-foreground">Hace {daysSinceCreated}d</span>
          </div>
          <Button onClick={handleViewMore} variant="seeMore" size="sm">
            Ver más
          </Button>
        </div>
      </div>
    </Card>
  );
};
