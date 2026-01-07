import { useQuery } from '@tanstack/react-query';
import { getUserFavoriteRealEstates } from './getUserFavoriteRealEstates.api';

export interface UseGetUserFavoriteRealEstatesProps {
  userId: string | null;
}
export const useGetUserFavoriteRealEstates = ({ userId }: UseGetUserFavoriteRealEstatesProps) => {
  return useQuery({
    queryKey: ['favoriteRealEstates', userId],
    queryFn: () => getUserFavoriteRealEstates(),
    enabled: !!userId,
  });
};
