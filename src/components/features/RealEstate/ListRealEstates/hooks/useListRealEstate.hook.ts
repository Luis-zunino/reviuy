import { useInfiniteRealEstates } from '@/services';
import { useMemo, useState } from 'react';
import { useDebounce } from '@/hooks';
import { useForm } from 'react-hook-form';
import { formSchema, FormSearcherRealEstate } from '../components/RealEstateSidebar/types';
import { zodResolver } from '@hookform/resolvers/zod';

export const useListRealEstate = () => {
  const [isCreateRealEstateOpen, setIsCreateRealEstateOpen] = useState(false);

  const form = useForm<FormSearcherRealEstate>({
    defaultValues: {
      real_estate_name: '',
      rating: 0,
    },
    resolver: zodResolver(formSchema),
  });
  const { watch, setValue } = form;
  const { real_estate_name, rating } = watch();
  const debouncedSearchValue = useDebounce(real_estate_name, 300);
  // Infinite query for real estates
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteRealEstates({ search: debouncedSearchValue, rating: rating });

  const filteredRealEstates = useMemo(() => data?.pages.flatMap((page) => page.data) ?? [], [data]);

  const handleClearFilters = () => {
    setValue('real_estate_name', '');
    setValue('rating', 0);
  };

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return {
    isLoading,
    handleClearFilters,
    isFetchingNextPage,
    loadMore,
    hasNextPage,
    form,
    displayedItems: filteredRealEstates,
    isCreateRealEstateOpen,
    setIsCreateRealEstateOpen,
  };
};
