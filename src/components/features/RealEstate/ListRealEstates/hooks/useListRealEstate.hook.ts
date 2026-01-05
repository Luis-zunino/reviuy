import { useGetAllRealEstates } from '@/services';
import type { RealEstate } from '@/types';
import { useMemo, useState } from 'react';

export const useListRealEstate = () => {
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [selectedRealEstate, setSelectedRealEstate] = useState<RealEstate | null>(null);
  const [searchValue, setSearchValue] = useState<string | null>(null);

  const { data: realEstates, isLoading } = useGetAllRealEstates();

  const filteredRealEstates = useMemo(() => {
    if (!realEstates) return [];

    let filtered = [...realEstates];

    if (selectedRealEstate) {
      filtered = filtered.filter((re) => re.id === selectedRealEstate.id);
    }

    if (searchValue && searchValue?.length > 0) {
      filtered = filtered.filter((re) => re.name.toLowerCase().includes(searchValue.toLowerCase()));
    }
    if (selectedRating > 0) {
      const minRating = selectedRating;
      filtered = filtered.filter((re) => {
        const rating = re.rating ? parseFloat(re.rating.toString()) : 0;
        return rating >= minRating;
      });
    }

    return filtered;
  }, [realEstates, selectedRealEstate, selectedRating, searchValue]);

  const handleRealEstateSelect = (realEstate: RealEstate | null) => {
    setSelectedRealEstate(realEstate);
  };

  const handleClearFilters = () => {
    setSelectedRating(0);
    setSelectedRealEstate(null);
    setSearchValue(null);
  };

  return {
    filteredRealEstates,
    selectedRating,
    selectedRealEstate,
    searchValue,
    isLoading,
    setSearchValue,
    handleRealEstateSelect,
    handleClearFilters,
    setSelectedRating,
  };
};
