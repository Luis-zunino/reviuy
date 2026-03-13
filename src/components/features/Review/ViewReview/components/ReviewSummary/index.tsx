'use client';

import { SquareArrowRight } from 'lucide-react';
import {
  DeleteReviewButton,
  EditReviewButton,
  ReportReviewButton,
  FavoriteReviewButton,
  ReviewLikesButtons,
  StarRatingDisplay,
  FeedBackBadge,
} from '@/components/common';
import type { ReviewSummaryProps } from './types';
import { PagesUrls, RoomType } from '@/enums';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import {
  translateComfort,
  translateHumidity,
  translatePropertyType,
  translateRoomType,
} from '@/utils';

export const ReviewSummary = ({ review }: ReviewSummaryProps) => {
  const recommended = (review.rating ?? 0) >= 3.5;

  return (
    <div className="space-y-6">
      <div className="flex w-full flex-wrap md:flex-nowrap items-center justify-between gap-4 align-middle">
        <div className="mr-auto">
          <FeedBackBadge recommended={recommended} />
        </div>
        <FavoriteReviewButton reviewId={review.id ?? ''} showText />
        <EditReviewButton review={review} showText />
        <ReportReviewButton review={review} showText />
        <DeleteReviewButton review={review} showText />
      </div>

      <Card className="shadow-sm border-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-foreground">Opinión</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6 space-y-6">
          <div>
            <h3 className="font-bold text-lg mb-3 text-foreground text-balance">{review?.title}</h3>
            <p className="text-base text-muted-foreground leading-relaxed text-pretty">
              {review?.description}
            </p>
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-sm border-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-foreground">Valoración</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <span className="text-sm font-semibold text-foreground">Temperatura en verano</span>
              <p className="text-base capitalize text-muted-foreground">
                {translateComfort(review?.summer_comfort)}
              </p>
            </div>
            <div className="space-y-2">
              <span className="text-sm font-semibold text-foreground">Temperatura en invierno</span>
              <p className="text-base capitalize text-muted-foreground">
                {translateComfort(review?.winter_comfort)}
              </p>
            </div>
            <div className="space-y-2">
              <span className="text-sm font-semibold text-foreground">Humedad</span>
              <p className="text-base capitalize text-muted-foreground">
                {translateHumidity(review?.humidity)}
              </p>
            </div>
            <div className="space-y-2">
              <span className="text-sm font-semibold text-foreground">Rating de la zona</span>
              {review?.zone_rating ? <StarRatingDisplay rating={review.zone_rating || 0} /> : null}
            </div>
            <div className="space-y-2">
              <span className="text-sm font-semibold text-foreground">Tipo de propiedad</span>
              <p className="text-base capitalize text-muted-foreground">
                {translatePropertyType(review?.property_type)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {review.review_rooms?.length > 0 && (
        <Card className="shadow-sm border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-foreground">Habitaciones</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            <div className="space-y-4">
              {review.review_rooms.map((room) => (
                <div
                  key={room.id}
                  className="flex items-center justify-between py-3 px-4 rounded-lg bg-accent/50 hover:bg-accent transition-colors"
                >
                  <span className="text-base text-foreground capitalize">
                    {translateRoomType(room.room_type as RoomType)}
                  </span>
                  <span className="text-base font-semibold text-foreground">{room.area_m2} m²</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {review.real_estate_experience || review?.real_estates?.name ? (
        <Card className="shadow-sm border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-foreground">Inmobiliaria</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 gap-6">
              {review?.real_estates?.name ? (
                <div className="space-y-2">
                  <span className="text-sm font-semibold text-foreground">Nombre</span>
                  <div className="flex items-center gap-3">
                    <Link
                      href={PagesUrls.REAL_ESTATE_VIEW.replace(
                        ':id',
                        review?.real_estates?.id ?? ''
                      )}
                      className="flex gap-2 justify-center"
                    >
                      <p className="text-base capitalize text-muted-foreground">
                        {review?.real_estates.name}
                      </p>
                      <SquareArrowRight className="h-5 w-5 text-base capitalize text-muted-foreground" />
                    </Link>
                  </div>
                </div>
              ) : null}
              {review.real_estate_experience ? (
                <div className="space-y-2">
                  <span className="text-sm font-semibold text-foreground">Comentario</span>
                  <p className="text-base capitalize text-muted-foreground">
                    {review.real_estate_experience}
                  </p>
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>
      ) : null}

      <Card className="shadow-sm border-border/50">
        <CardContent className="p-6">
          <ReviewLikesButtons
            id={review.id ?? ''}
            likes={review?.likes ?? 0}
            dislikes={review?.dislikes ?? 0}
          />
        </CardContent>
      </Card>
    </div>
  );
};
