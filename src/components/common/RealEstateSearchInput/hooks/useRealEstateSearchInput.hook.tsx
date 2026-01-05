import { PagesUrls } from '@/enums';
import { useDebounce } from '@/hooks';
import { useSearchRealEstates } from '@/services';
import type { RealEstate } from '@/types';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { UseRealEstateSearchInputProps } from './types';

export const useRealEstateSearchInput = (props: UseRealEstateSearchInputProps) => {
  const { onRealEstateSelect, selectedRealEstate, onChange, value } = props;
  const router = useRouter();
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [showResults, setShowResults] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState<string>(value || '');
  const debouncedSearchTerm = useDebounce(searchInput, 300);
  const { data, isLoading } = useSearchRealEstates({
    query: debouncedSearchTerm.toLocaleLowerCase(),
  });

  const handleInputChange = (val: string) => {
    if (!val) {
      onRealEstateSelect(null);
      onChange?.('');
    }

    setSearchInput(val);

    setShowResults(true);
  };

  const handleRealEstateClick = (realEstate: RealEstate) => {
    setSearchInput('');
    onChange?.(realEstate.id);
    onRealEstateSelect(realEstate);

    setShowResults(false);
    setIsFocused(false);
  };

  const clearSelection = () => {
    setSearchInput('');
    onChange?.('');
    onRealEstateSelect(null);
  };

  const handleCreateNew = (isModal?: boolean) => {
    if (isModal) {
      setIsModalOpen(true);
      return;
    }
    router.push(PagesUrls.REAL_ESTATE_CREATE);
  };

  const shouldShowNoResults =
    showResults && !isLoading && data?.length === 0 && debouncedSearchTerm.trim().length >= 2;

  const onOpenChange = (open: boolean) => setIsModalOpen(open);

  useEffect(() => {
    if (selectedRealEstate) {
      setSearchInput('');
    }
  }, [selectedRealEstate]);

  return {
    value: searchInput,
    handleInputChange,
    setIsFocused,
    setShowResults,
    isFocused,
    showResults,
    isLoading,
    results: data,
    handleRealEstateClick,
    shouldShowNoResults,
    debouncedSearchTerm,
    handleCreateNew,
    isModalOpen,
    onOpenChange,
    clearSelection,
  };
};
