import { useQuery } from '@tanstack/react-query';
import { isRealEstateFavorite } from './isRealEstateFavorite.api';

export interface UseIsRealEstateFavoriteProps {
  realEstateId: string;
  userId: string | null;
}
export const useIsRealEstateFavorite = ({ realEstateId, userId }: UseIsRealEstateFavoriteProps) => {
  return useQuery({
    queryKey: ['isFavorite', realEstateId, userId],
    queryFn: () => isRealEstateFavorite({ realEstateId }),
    enabled: !!userId && !!realEstateId,
    staleTime: 0,
  });
};
