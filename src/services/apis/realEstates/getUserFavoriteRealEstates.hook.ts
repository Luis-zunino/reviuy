import { useQuery } from '@tanstack/react-query';
import { getUserFavoriteRealEstates } from './getUserFavoriteRealEstates.api';

export const useGetUserFavoriteRealEstates = () => {
  return useQuery({
    queryKey: ['favoriteRealEstates'],
    queryFn: () => getUserFavoriteRealEstates(),
  });
};
