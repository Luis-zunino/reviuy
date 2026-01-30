import { StarRatingDisplay } from '@/components/common';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { TabsContent } from '@/components/ui/tabs';
import { PagesUrls } from '@/enums';
import { RealEstateReviewWithVotes } from '@/types';
import { Calendar, Eye, MessageSquare, Pencil, ThumbsDown, ThumbsUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

export interface RealEstateReviewTabContentProps {
  realEstateReview?: RealEstateReviewWithVotes[] | null;
  realEstateId: string;
  userId: string;
}

export const RealEstateReviewTabContent = (props: RealEstateReviewTabContentProps) => {
  const { realEstateReview, realEstateId, userId } = props;
  const { push } = useRouter();
  return (
    <TabsContent value="realEstateReview" className="mt-6">
      <section>
        <Card>
          <CardContent>
            {realEstateReview?.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Aún no hay reseñas para esta inmobiliaria</p>
                <Button
                  onClick={() =>
                    push(PagesUrls.REAL_ESTATE_CREATE_REVIEW.replace(':id', realEstateId))
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
                      className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0"
                    >
                      <div className="flex gap-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 mb-1 truncate">{rer.title}</h4>
                          <p className="text-gray-600 mb-2 truncate">{rer.description}</p>
                          <StarRatingDisplay rating={rer.rating ?? 0} />
                        </div>
                        <div className="grid grid-cols-1 gap-2 ml-auto">
                          <Button
                            variant="seeMore"
                            onClick={() =>
                              push(
                                PagesUrls.REAL_ESTATE_VIEW_REVIEW.replace(
                                  ':id',
                                  realEstateId
                                ).replace(':reviewId', rer.id ?? '')
                              )
                            }
                            size="sm"
                            icon={Eye}
                          >
                            <span className="hidden md:inline">Ver</span>
                          </Button>
                          {isOwner ? (
                            <Button
                              variant="outline"
                              onClick={() =>
                                push(
                                  PagesUrls.REAL_ESTATE_UPDATE_REVIEW.replace(
                                    ':id',
                                    realEstateId
                                  ).replace(':reviewId', rer.id ?? '')
                                )
                              }
                              icon={Pencil}
                              size="sm"
                            >
                              <span className="hidden md:inline">Editar</span>
                            </Button>
                          ) : null}
                        </div>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex items-center gap-2 justify-between">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Calendar className="h-4 w-4" />
                          {new Date(rer.created_at ?? '').toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="h-4 w-4" /> {rer.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <ThumbsDown className="h-4 w-4" /> {rer.dislikes}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </TabsContent>
  );
};
