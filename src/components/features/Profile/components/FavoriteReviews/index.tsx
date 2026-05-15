import { PagesUrls } from '@/enums';
import { SkeletonSection } from '../SkeletonSection';
import { Search } from 'lucide-react';
import { ReviewCard } from '@/components/common';
import { EmptySection } from '../EmptySection';
import { GetCurrentUserFavoriteReviewsOutput } from '@/modules/profiles';
import { ProfileSectionList } from '../ProfileSectionList';

export interface FavoriteReviewsProps {
  loadingFavoriteReviews: boolean;
  favoriteReviews: GetCurrentUserFavoriteReviewsOutput;
}
export const FavoriteReviews = (props: FavoriteReviewsProps) => {
  const { loadingFavoriteReviews, favoriteReviews } = props;

  if (loadingFavoriteReviews) {
    return <SkeletonSection />;
  }

  if (!favoriteReviews || favoriteReviews.length === 0) {
    return (
      <EmptySection
        title="No tienes reseñas en favoritos"
        link={PagesUrls.HOME}
        icon={Search}
        description="Explorar reseñas"
      />
    );
  }

  return (
    <ProfileSectionList title="Reseñas favoritas">
      {favoriteReviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </ProfileSectionList>
  );
};
