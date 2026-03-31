import { useInfiniteQuery } from '@tanstack/react-query';
import { RealEstateWitheVotes } from '@/types';
import { supabaseClient } from '@/lib/supabase';
import {
  createGetAllRealEstatesPaginatedQuery,
  SupabaseRealEstateReadRepository,
} from '@/modules/real-estates';

const DEFAULT_LIMIT = 10;
const repository = new SupabaseRealEstateReadRepository(supabaseClient);
const getAllRealEstatesPaginated = createGetAllRealEstatesPaginatedQuery({ repository });

export interface UseInfiniteRealEstatesParams {
  search?: string | null;
  rating?: number | null;
}
export type RealEstatesPage = {
  data: RealEstateWitheVotes[];
  nextOffset: number | null;
};

export const useInfiniteRealEstates = (props: UseInfiniteRealEstatesParams) => {
  return useInfiniteQuery({
    queryKey: ['realEstates', 'infinite', { ...props }],
    queryFn: async ({ pageParam = 0 }) => {
      const page = await getAllRealEstatesPaginated({
        limit: DEFAULT_LIMIT,
        offset: pageParam,
        ...props,
      });
      return page;
    },
    getNextPageParam: (lastPage: RealEstatesPage) => lastPage.nextOffset ?? undefined,
    initialPageParam: 0,
  });
};
