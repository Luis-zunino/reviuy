'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { StarRatingDisplay, FavoriteReviewButton } from '@/components/common';
import { PagesUrls } from '@/enums';
import Link from 'next/link';
import type { ReviewCardProps } from './types';

export const ReviewCard = ({ review }: ReviewCardProps) => {
  const reviewUrl = PagesUrls.REVIEW_DETAILS.replace(':id', review.id);

  return (
    <Card
      className="min-w-80 flex flex-col overflow-hidden transition-shadow hover:shadow-md group"
      role="article"
    >
      <Link href={reviewUrl} className="flex flex-col flex-1">
        {/* HEADER */}
        <CardHeader className="pb-3 w-full">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <CardTitle>
                <p className="text-lg line-clamp-1 overflow-hidden text-ellipsis">{review.title}</p>
              </CardTitle>

              <CardDescription className="mt-1 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="truncate">{review.address_text}</span>
              </CardDescription>
            </div>

            <div onClick={(e) => e.preventDefault()}>
              <FavoriteReviewButton reviewId={review.id} />
            </div>
          </div>
        </CardHeader>

        {/* CONTENT */}
        <CardContent className="flex flex-col gap-3 flex-1">
          <div className="flex sm:flex-col xl:flex-row gap-3 text-sm justify-between">
            <div className="flex flex-col gap-2">
              <span className="shrink-0">Lugar:</span>
              <StarRatingDisplay
                rating={review.rating}
                aria-label={`Calificación del lugar: ${review.rating} estrellas`}
              />
            </div>

            <div className="flex flex-col gap-2">
              <span className="shrink-0">Zona:</span>
              <StarRatingDisplay
                rating={review.zone_rating ?? 0}
                aria-label={`Calificación de la zona: ${review.zone_rating ?? 0} estrellas`}
              />
            </div>
          </div>

          <p className="text-sm text-gray-700 line-clamp-3">{review.description}</p>
        </CardContent>
      </Link>

      {/* FOOTER */}
      <CardFooter className="flex items-end justify-end">
        <Link
          href={reviewUrl}
          aria-label="Ver detalles de la reseña"
          className="flex items-center gap-2"
        >
          Ver más
        </Link>
      </CardFooter>
    </Card>
  );
};
