'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FeedBackBadge, StarRatingDisplay } from '@/components/common';
import { PagesUrls } from '@/enums';
import { Calendar, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { ReviewWithVotesPublic } from '@/modules/property-reviews';

interface ExploreReviewCardProps {
  review: ReviewWithVotesPublic;
}

export const ExploreReviewCard = ({ review }: ExploreReviewCardProps) => {
  const router = useRouter();
  const recommended = (review.rating ?? 0) >= 3.5;

  const daysSinceCreated = Math.floor(
    (new Date().getTime() - new Date(review.created_at ?? '').getTime()) / (1000 * 60 * 60 * 24)
  );

  const handleViewMore = () => {
    router.push(PagesUrls.REVIEW_DETAILS.replace(':id', review.id ?? ''));
  };

  const handleAddressClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (review.address_osm_id) {
      router.push(PagesUrls.ADDRESS_DETAILS.replace(':osmId', review.address_osm_id));
    }
  };

  return (
    <Card className="flex flex-col overflow-hidden transition-shadow hover:shadow-md h-full">
      <FeedBackBadge recommended={recommended} />
      <CardHeader className="pb-2 pt-3">
        <CardTitle className="text-sm font-semibold line-clamp-1">{review.title}</CardTitle>
        <button
          onClick={handleAddressClick}
          className="flex items-start gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors text-left group/addr mt-1"
          aria-label={`Ver todas las reseñas de ${review.address_text}`}
        >
          <MapPin
            className="h-3 w-3 mt-0.5 shrink-0 group-hover/addr:text-primary"
            aria-hidden="true"
          />
          <span className="line-clamp-2 leading-relaxed">{review.address_text}</span>
        </button>
      </CardHeader>

      <CardContent className="flex-1 pb-2">
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
          {review.description}
        </p>
        <div className="mt-3">
          <StarRatingDisplay rating={review.rating ?? 0} />
        </div>
      </CardContent>

      <Separator />

      <CardFooter className="pt-3 pb-3 flex justify-between items-center">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" aria-hidden="true" />
          <span>Hace {daysSinceCreated}d</span>
        </div>
        <Button onClick={handleViewMore} variant="seeMore" size="sm">
          Ver más
        </Button>
      </CardFooter>
    </Card>
  );
};
