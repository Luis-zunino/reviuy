import { useInfiniteQuery } from '@tanstack/react-query';
import { RealEstate } from '@/types';
import { getAllRealEstatesPaginated } from './getAllRealEstatesPaginated.api';

const DEFAULT_LIMIT = 10;

export interface UseInfiniteRealEstatesParams {
  search?: string | null;
  rating?: number | null;
}
export type RealEstatesPage = {
  data: RealEstate[];
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
