import {
  FavoriteRealEstateButton,
  RealEstateVoteButtons,
  ReportRealEstateButton,
  StarRatingDisplay,
} from '@/components/common';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import React from 'react';
import type { ViewRealEstateDetailsHeaderProps } from './types';
import { NotebookPen } from 'lucide-react';
import { useViewRealEstateDetailsHeader } from './hooks';

export const ViewRealEstateDetailsHeader = (props: ViewRealEstateDetailsHeaderProps) => {
  const { averageRating, amountReviews } = props;
  const {
    realEstateId,
    realEstate,
    hasRealEstateReview,
    userRealEstateVote,
    refetchRealEstate,
    refetchRealEstateVote,
    isLoading,
    isLoadingVote,
    handleOnCreateReview,
  } = useViewRealEstateDetailsHeader();

  return (
    <div className="grid grid-cols-1 gap-6">
      <Card>
        <CardContent>
          <div className="flex justify-between gap-6">
            <div className="space-y-4 sm:w-1/2">
              <h3 className="font-semibold mb-3">{realEstate?.name}</h3>
              <div className="flex items-center gap-3">
                <div className="text-3xl font-bold">{averageRating.toFixed(1)}</div>
                <div>
                  <StarRatingDisplay rating={averageRating} />
                  <p className="text-sm mt-1">
                    {amountReviews} {amountReviews === 1 ? 'reseña' : 'reseñas'}
                  </p>
                </div>
              </div>
            </div>
            <div className="content-center flex flex-col">
              <div className="mt-4 grid grid-cols-1 gap-2">
                <FavoriteRealEstateButton realEstateId={realEstateId} showText />
                {realEstate ? <ReportRealEstateButton realEstate={realEstate} showText /> : null}
                {hasRealEstateReview ? null : (
                  <Button
                    onClick={handleOnCreateReview}
                    className="max-w-min"
                    size="sm"
                    icon={NotebookPen}
                  >
                    <span className="hidden sm:inline">Crea tu reseña</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex flex-col mx-auto items-center">
        <p className="text-sm mb-2">¿Recomendarías esta inmobiliaria?</p>
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
    </div>
  );
};
