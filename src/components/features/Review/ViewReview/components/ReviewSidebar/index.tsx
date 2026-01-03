import { LazyMapComponent, StarRatingDisplay } from '@/components/common';
import { MapPinned, Calendar, Home } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ReviewSidebarProps } from './types';

export const ReviewSidebar = ({ review }: ReviewSidebarProps) => {
  const addressText = review?.address_text;
  const recommended = (review?.rating ?? 0) >= 3.5;

  return (
    <div className="space-y-6">
      <div className="lg:hidden">
        <Badge
          variant={recommended ? 'default' : 'destructive'}
          className={`w-full justify-center py-3 text-sm font-semibold uppercase tracking-wide ${
            recommended ? 'bg-success hover:bg-success/90 text-success-foreground' : ''
          }`}
        >
          {recommended ? '✓ Lo recomiendo' : '✗ No lo recomiendo'}
        </Badge>
      </div>

      <div className="lg:sticky lg:top-6 space-y-6">
        <Card className="shadow-sm border-border/50">
          <CardContent className="p-6 space-y-6">
            {/* Mobile address */}
            <div className="flex lg:hidden items-start gap-3 pb-6 border-b border-border">
              <MapPinned className="h-5 w-5 mt-0.5 flex-shrink-0 text-muted-foreground" />
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

            {/* Property type with icon */}
            <div className="flex items-center gap-3 pt-4 border-t border-border">
              <Home className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">Tipo de propiedad</span>
                <span className="text-sm font-medium text-foreground capitalize">
                  {review?.property_type}
                </span>
              </div>
            </div>

            {/* Publication date with icon */}
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
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
            <LazyMapComponent lat={review?.latitude ?? 0} lon={review?.longitude ?? 0} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
