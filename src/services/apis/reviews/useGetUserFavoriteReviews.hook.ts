import { useQuery } from '@tanstack/react-query';
import { getUserFavoriteReviews } from './getUserFavoriteReviews.api';
import { useAuth } from '@/hooks';

export const useGetUserFavoriteReviews = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['favoriteReviews', user?.id],
    queryFn: getUserFavoriteReviews,
    enabled: !!user,
  });
};
