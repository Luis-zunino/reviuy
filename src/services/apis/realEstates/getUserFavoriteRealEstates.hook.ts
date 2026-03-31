import { useQuery } from '@tanstack/react-query';
import { supabaseClient } from '@/lib/supabase';
import {
  createGetUserFavoriteRealEstatesQuery,
  SupabaseRealEstateReadRepository,
} from '@/modules/real-estates';

const repository = new SupabaseRealEstateReadRepository(supabaseClient);
const getUserFavoriteRealEstates = createGetUserFavoriteRealEstatesQuery({ repository });

export const useGetUserFavoriteRealEstates = () => {
  return useQuery({
    queryKey: ['favoriteRealEstates'],
    queryFn: () => getUserFavoriteRealEstates({}),
  });
};
