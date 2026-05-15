import { TabsContent } from '@/components/ui/tabs';
import { TabDetailsSkeleton } from '../../../TabDetailsSkeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Eye, MapPin, MessageSquare, ThumbsDown, ThumbsUp } from 'lucide-react';
import { StarRatingDisplay } from '@/components/common';
import { Button } from '@/components/ui/button';
import { PagesUrls } from '@/enums';
import { useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { ReviewWithVotesPublic } from '@/modules/property-reviews';

export interface RealEstateUserExperienceTabContentProps {
  reviews: ReviewWithVotesPublic[];
  isLoadingReviews: boolean;
}
export const RealEstateUserExperienceTabContent = (
  props: RealEstateUserExperienceTabContentProps
) => {
  const { reviews, isLoadingReviews } = props;
  const { push } = useRouter();

  return (
    <TabsContent value="realEstateUserExperience" className="mt-6">
      <section>
        {isLoadingReviews ? (
          <TabDetailsSkeleton />
        ) : reviews?.length === 0 ? (
          <Card>
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="mb-4">Aún no hay reseñas para esta inmobiliaria</p>
            </div>
          </Card>
        ) : reviews?.length > 0 ? (
          <Card>
            <CardContent>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0"
                  >
                    <div className="flex gap-2">
                      <div className="flex-1 min-w-0 gap-2">
                        <h4 className="font-medium text-gray-900 mb-1 truncate">
                          {review.real_estate_experience}
                        </h4>
                        <p className="text-gray-600 mb-2 truncate">{review.title}</p>
                        <StarRatingDisplay rating={review.rating ?? 0} />
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" color="gray" />
                          <p className="text-gray-600 truncate"> {review.address_text}</p>
                        </div>
                      </div>
                      <Button
                        variant="seeMore"
                        onClick={() =>
                          push(PagesUrls.REVIEW_DETAILS.replace(':id', review.id ?? ''))
                        }
                        icon={Eye}
                        size="sm"
                      >
                        <span className="hidden md:inline">Ver</span>
                      </Button>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        {new Date(review.created_at ?? '').toLocaleDateString()}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="h-4 w-4" /> {review.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <ThumbsDown className="h-4 w-4" /> {review.dislikes}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : null}
      </section>
    </TabsContent>
  );
};
