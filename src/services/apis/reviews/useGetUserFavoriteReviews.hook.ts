import { useQuery } from '@tanstack/react-query';
import { getUserFavoriteReviews } from './getUserFavoriteReviews.api';
export interface UseGetUserFavoriteReviewsProps {
  userId: string | null;
}
export const useGetUserFavoriteReviews = ({ userId }: UseGetUserFavoriteReviewsProps) => {
  return useQuery({
    queryKey: ['favoriteReviews', userId],
    queryFn: getUserFavoriteReviews,
    enabled: !!userId,
  });
};
