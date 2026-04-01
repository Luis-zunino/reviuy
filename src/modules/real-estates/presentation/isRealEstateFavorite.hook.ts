import { useQuery } from '@tanstack/react-query';
import { supabaseClient } from '@/lib/supabase';
import {
  createIsRealEstateFavoriteQuery,
  SupabaseRealEstateReadRepository,
} from '@/modules/real-estates';

const repository = new SupabaseRealEstateReadRepository(supabaseClient);
const isRealEstateFavorite = createIsRealEstateFavoriteQuery({ repository });

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
