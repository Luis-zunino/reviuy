import { useQuery } from '@tanstack/react-query';
import { getUserFavoriteRealEstates } from './getUserFavoriteRealEstates.api';
import { useAuth } from '@/hooks';

export const useGetUserFavoriteRealEstates = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['favoriteRealEstates', user?.id],
    queryFn: () => getUserFavoriteRealEstates(),
    enabled: !!user,
  });
};
