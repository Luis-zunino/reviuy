import { useQuery } from '@tanstack/react-query';
import { isRealEstateFavorite } from './isRealEstateFavorite.api';
import { useAuth } from '@/hooks';

export const useIsRealEstateFavorite = (realEstateId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['isFavorite', realEstateId, user?.id],
    queryFn: () => isRealEstateFavorite({ realEstateId }),
    enabled: !!user && !!realEstateId,
    staleTime: 0,
  });
};
