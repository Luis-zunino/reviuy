'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, MessageSquare, Calendar } from 'lucide-react';
import { PageStateWrapper } from '@/components/common';
import { StarRatingDisplay } from '@/components/common/StarRating';
import { PagesUrls } from '@/enums';
import { redirect } from 'next/navigation';
import { useViewRealEstateDetails } from './hooks';
import { ViewRealEstateDetailsHeader } from './ViewRealEstateDetailsHeader';
import { cn } from '@/lib/utils';

export const ViewRealEstateDetails = () => {
  const {
    realEstateReview,
    isLoadingRealEstateReview,
    error,
    realEstateId,
    isLoadingReviews,
    reviews,
    router,
    userId,
    averageRating,
  } = useViewRealEstateDetails();

  if (isLoadingRealEstateReview || isLoadingReviews) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
          <Card>
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !reviews) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <Card className="mt-6">
          <CardContent className="p-6 text-center">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">{'No se pudo encontrar la inmobiliaria'}</p>
            <Button onClick={() => window.history.back()} variant="outline">
              Volver atrás
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <PageStateWrapper>
      <div className="mt-6 space-y-6">
        {/* Información principal de la inmobiliaria */}
        <ViewRealEstateDetailsHeader
          averageRating={averageRating}
          amountReviews={realEstateReview?.length ?? 0}
        />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              Reseñas de usuarios
            </CardTitle>
          </CardHeader>
          <CardContent>
            {realEstateReview?.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Aún no hay reseñas para esta inmobiliaria</p>
                <Button
                  onClick={() =>
                    redirect(PagesUrls.REAL_ESTATE_CREATE_REVIEW.replace(':id', realEstateId))
                  }
                >
                  Ser el primero en reseñar
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {realEstateReview?.map((rer) => {
                  const isOwner = userId === rer.user_id;
                  return (
                    <div
                      key={rer.id}
                      className={cn(
                        'border-b border-gray-100 last:border-b-0 pb-4 last:pb-0',
                        `${isOwner ? 'bg-gray-100 rounded-lg p-1' : ''}`
                      )}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <StarRatingDisplay rating={rer.rating} />

                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Calendar className="h-3 w-3" />
                          {new Date(rer.created_at).toLocaleDateString()}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            onClick={() =>
                              router.push(
                                PagesUrls.REAL_ESTATE_VIEW_REVIEW.replace(
                                  ':id',
                                  realEstateId
                                ).replace(':reviewId', rer.id)
                              )
                            }
                          >
                            Ver
                          </Button>
                          {isOwner ? (
                            <Button
                              variant="outline"
                              onClick={() =>
                                router.push(
                                  PagesUrls.REAL_ESTATE_UPDATE_REVIEW.replace(
                                    ':id',
                                    realEstateId
                                  ).replace(':reviewId', rer.id)
                                )
                              }
                            >
                              Editar
                            </Button>
                          ) : null}
                        </div>
                      </div>

                      <h4 className="font-medium text-gray-900 mb-1">{rer.title}</h4>
                      <p className="text-gray-600 mb-2">{rer.description}</p>

                      <div className="flex items-center gap-2">
                        <span>👍 {rer.likes}</span>
                        <span>👎 {rer.dislikes}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {reviews?.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                Reseñas de usuarios donde se encuentra la inmobiliaria
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingReviews ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <StarRatingDisplay rating={review.rating} />
                        {review.address_text}
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Calendar className="h-3 w-3" />
                          {new Date(review.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">{review.title}</h4>
                          <p className="text-gray-600 mb-2">{review.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                              <span>👍 {review.likes}</span>
                              <span>👎 {review.dislikes}</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() =>
                            router.push(PagesUrls.REVIEW_DETAILS.replace(':id', review.id))
                          }
                        >
                          Ver
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ) : null}
      </div>
    </PageStateWrapper>
  );
};
