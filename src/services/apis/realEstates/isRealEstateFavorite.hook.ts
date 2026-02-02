import { useQuery } from '@tanstack/react-query';
import { isRealEstateFavorite } from './isRealEstateFavorite.api';

export interface UseIsRealEstateFavoriteProps {
  realEstateId: string;
}
export const useIsRealEstateFavorite = ({ realEstateId }: UseIsRealEstateFavoriteProps) => {
  return useQuery({
    queryKey: ['isFavorite', realEstateId],
    queryFn: () => isRealEstateFavorite({ realEstateId }),
    enabled: !!realEstateId,
    staleTime: 0,
  });
};
