import { useQuery } from '@tanstack/react-query';
import { getUserFavoriteReviews } from './getUserFavoriteReviews.api';

export const useGetUserFavoriteReviews = () => {
  return useQuery({
    queryKey: ['favoriteReviews'],
    queryFn: getUserFavoriteReviews,
  });
};
