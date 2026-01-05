import {
  FavoriteRealEstateButton,
  RealEstateVoteButtons,
  ReportRealEstateButton,
  StarRatingDisplay,
} from '@/components/common';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PagesUrls } from '@/enums';
import { useAuth } from '@/hooks';
import {
  useGetRealEstateById,
  useGetRealEstateReviewByUserId,
  useGetUserRealEstateVote,
} from '@/services';
import { redirect, useParams } from 'next/navigation';
import React from 'react';
import type { ViewRealEstateDetailsHeaderProps } from './types';

export const ViewRealEstateDetailsHeader = (props: ViewRealEstateDetailsHeaderProps) => {
  const { averageRating, amountReviews } = props;
  const { user } = useAuth();
  const { realEstateId } = useParams<{ realEstateId: string }>();
  const {
    data: realEstate,
    refetch: refetchRealEstate,
    isLoading,
  } = useGetRealEstateById(realEstateId);
  const { data: hasRealEstateReview } = useGetRealEstateReviewByUserId({
    userId: user?.id ?? '',
    realEstateId,
  });
  const {
    data: userRealEstateVote,
    refetch: refetchRealEstateVote,
    isLoading: isLoadingVote,
  } = useGetUserRealEstateVote({
    realEstateId,
    userId: user?.id,
  });

  return (
    <Card>
      <CardContent>
        <div className="flex justify-between gap-6">
          <div className="space-y-4 w-1/2">
            <h3 className="font-semibold text-gray-900 mb-3">
              Reseñas y calificaciones sobre: {realEstate?.name}
            </h3>
            <div className="flex items-center gap-3">
              <div className="text-3xl font-bold text-gray-900">{averageRating.toFixed(1)}</div>
              <div>
                <StarRatingDisplay rating={averageRating} />
                <p className="text-sm text-gray-600 mt-1">
                  {amountReviews} {amountReviews === 1 ? 'reseña' : 'reseñas'}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-2">¿Recomendarías esta inmobiliaria?</p>
            <RealEstateVoteButtons
              realEstateId={realEstateId}
              likes={realEstate?.likes ?? 0}
              dislikes={realEstate?.dislikes ?? 0}
              userVote={userRealEstateVote}
              refetchRealEstate={async () => {
                await refetchRealEstateVote();
                await refetchRealEstate();
              }}
              isLoading={isLoading || isLoadingVote}
            />
          </div>
          <div className="content-center mx-auto flex flex-col">
            <div className="mt-4 flex sm:flex-col gap-2">
              <FavoriteRealEstateButton realEstateId={realEstateId} showText />
              {realEstate ? <ReportRealEstateButton realEstate={realEstate} showText /> : null}
              {!hasRealEstateReview ? (
                <Button
                  onClick={() =>
                    redirect(PagesUrls.REAL_ESTATE_CREATE_REVIEW.replace(':id', realEstateId))
                  }
                  className="max-w-min"
                  size="sm"
                >
                  Crea tu reseña
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
