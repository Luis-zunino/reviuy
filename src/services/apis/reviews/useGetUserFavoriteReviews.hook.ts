import { useQuery } from '@tanstack/react-query';
import { getUserFavoriteReviews } from './getUserFavoriteReviews.api';
import { User } from '@supabase/supabase-js';

export interface UseGetUserFavoriteReviewsProps {
  user: User | null;
}
export const useGetUserFavoriteReviews = ({ user }: UseGetUserFavoriteReviewsProps) => {
  return useQuery({
    queryKey: ['favoriteReviews', user?.id],
    queryFn: getUserFavoriteReviews,
    enabled: !!user,
  });
};
