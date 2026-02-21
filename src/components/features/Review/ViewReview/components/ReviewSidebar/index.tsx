import { FeedBackBadge, LazyMapComponent, StarRatingDisplay } from '@/components/common';
import { MapPinned, Calendar, Home, DoorClosed } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { ReviewSidebarProps } from './types';
import { PropertyType } from '@/enums';
import { translatePropertyType } from '@/utils';

export const ReviewSidebar = ({ review }: ReviewSidebarProps) => {
  const addressText = review?.address_text;
  const recommended = (review?.rating ?? 0) >= 3.5;

  return (
    <div className="space-y-6">
      <div className="lg:hidden">
        <FeedBackBadge recommended={recommended} />
      </div>

      <div className="lg:sticky lg:top-6 space-y-6">
        <Card className="shadow-sm border-border/50">
          <CardContent className="p-6 space-y-6">
            {/* Mobile address */}
            <div className="flex lg:hidden items-start gap-3 pb-6 border-b border-border">
              <MapPinned className="h-5 w-5 mt-0.5 shrink-0 text-muted-foreground" />
              <p className="text-sm leading-relaxed text-foreground">{addressText}</p>
            </div>

            {/* Rating section with improved spacing */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">
                  Rating de la experiencia
                </span>
              </div>
              {review?.rating ? (
                <StarRatingDisplay rating={review.rating} showLabel={false} />
              ) : null}
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-border">
              <Home className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">Tipo de propiedad</span>
                <span className="text-sm font-medium text-foreground capitalize">
                  {translatePropertyType(review?.property_type)}
                </span>
              </div>
            </div>

            {review?.property_type !== PropertyType.HOUSE ? (
              <div className="flex items-center gap-3 pt-4">
                <DoorClosed className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">Nº de apartamento</span>
                  <span className="text-sm font-medium text-foreground capitalize">
                    {review?.apartment_number || 'N/A'}
                  </span>
                </div>
              </div>
            ) : null}

            <div className="flex items-center gap-3 pt-4 border-t border-border">
              <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">Fecha de publicación</span>
                <span className="text-sm font-medium text-foreground">
                  {review?.created_at
                    ? new Date(review.created_at).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'Sin fecha'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden shadow-sm border-border/50 p-0">
          <CardContent className="p-0">
            <LazyMapComponent
              key={review?.latitude}
              lat={review?.latitude ?? 0}
              lon={review?.longitude ?? 0}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
