import { useInfiniteRealEstates } from '@/services';
import type { RealEstate } from '@/types/realEstate';
import { useMemo, useState } from 'react';
import { useDebounce } from '@/hooks';

export const useListRealEstate = () => {
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [selectedRealEstate, setSelectedRealEstate] = useState<RealEstate | null>(null);
  const [searchValue, setSearchValue] = useState<string | null>(null);

  const debouncedSearchValue = useDebounce(searchValue, 300);

  // Infinite query for real estates
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteRealEstates({ search: debouncedSearchValue, rating: selectedRating });

  const allItems = useMemo(() => data?.pages.flatMap((page) => page.data) ?? [], [data]);

  const filteredRealEstates = useMemo(() => {
    let filtered = [...allItems];
    if (selectedRealEstate) {
      filtered = filtered.filter((re) => re.id === selectedRealEstate.id);
    }

    if (selectedRating > 0) {
      const minRating = selectedRating;
      filtered = filtered.filter((re) => {
        const rating = re.rating ? parseFloat(re.rating.toString()) : 0;
        return rating >= minRating;
      });
    }

    return filtered;
  }, [allItems, selectedRealEstate, selectedRating]);

  const handleRealEstateSelect = (realEstate: RealEstate | null) => {
    setSelectedRealEstate(realEstate);
  };

  const handleClearFilters = () => {
    setSelectedRating(0);
    setSelectedRealEstate(null);
    setSearchValue(null);
  };

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return {
    selectedRating,
    selectedRealEstate,
    searchValue,
    isLoading,
    displayedItems: filteredRealEstates,
    setSearchValue,
    handleRealEstateSelect,
    handleClearFilters,
    setSelectedRating,
    isFetchingNextPage,
    // paginación
    loadMore,
    hasNextPage,
  };
};
