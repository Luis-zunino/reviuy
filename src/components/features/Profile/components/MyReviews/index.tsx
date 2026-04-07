import { Plus } from 'lucide-react';
import { EmptySection } from '../EmptySection';
import { PagesUrls } from '@/enums';
import { ReviewCard } from '@/components/common';
import { GetCurrentUserReviewsOutput } from '@/modules/profiles';
import { SkeletonSection } from '../SkeletonSection';
import { ProfileSectionList } from '../ProfileSectionList';

export interface MyReviewsProps {
  refetch: () => void;
  reviews: GetCurrentUserReviewsOutput;
  isLoading: boolean;
}
export const MyReviews = (props: MyReviewsProps) => {
  const { refetch, reviews, isLoading } = props;

  if (isLoading) {
    return <SkeletonSection />;
  }

  if (reviews?.length === 0) {
    return (
      <EmptySection
        title="No has publicado ninguna reseña aún."
        link={PagesUrls.REVIEW_CREATE}
        icon={Plus}
        description="Crear tu primera reseña"
      />
    );
  }
  return (
    <ProfileSectionList
      title="Mis reseñas publicadas"
      actionButton={() => refetch()}
      actionButtonLabel="Actualizar"
    >
      {reviews?.map((review) => (
        <ReviewCard review={review} key={review.id} />
      ))}
    </ProfileSectionList>
  );
};
