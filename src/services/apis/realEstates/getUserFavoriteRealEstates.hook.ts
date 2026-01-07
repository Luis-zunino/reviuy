import { useQuery } from '@tanstack/react-query';
import { getUserFavoriteRealEstates } from './getUserFavoriteRealEstates.api';
import { User } from '@supabase/supabase-js';

export interface UseGetUserFavoriteRealEstatesProps {
  user: User | null;
}
export const useGetUserFavoriteRealEstates = ({ user }: UseGetUserFavoriteRealEstatesProps) => {
  return useQuery({
    queryKey: ['favoriteRealEstates', user?.id],
    queryFn: () => getUserFavoriteRealEstates(),
    enabled: !!user,
  });
};
