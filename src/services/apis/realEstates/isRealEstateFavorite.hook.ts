import { useQuery } from '@tanstack/react-query';
import { isRealEstateFavorite } from './isRealEstateFavorite.api';
import { User } from '@supabase/supabase-js';

export interface UseIsRealEstateFavoriteProps {
  realEstateId: string;
  user: User | null;
}
export const useIsRealEstateFavorite = ({ realEstateId, user }: UseIsRealEstateFavoriteProps) => {
  return useQuery({
    queryKey: ['isFavorite', realEstateId, user?.id],
    queryFn: () => isRealEstateFavorite({ realEstateId }),
    enabled: !!user && !!realEstateId,
    staleTime: 0,
  });
};
