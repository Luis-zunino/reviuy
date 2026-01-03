import { PagesUrls } from '@/enums';
import { useDebounce } from '@/hooks';
import { searchRealEstates } from '@/services';
import type { RealEstate } from '@/types';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { UseRealEstateSearchInputProps } from './types';

export const useRealEstateSearchInput = (props: UseRealEstateSearchInputProps) => {
  const { onRealEstateSelect, selectedRealEstate, onChange, value } = props;
  const router = useRouter();
  const [results, setResults] = useState<RealEstate[]>([]);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showResults, setShowResults] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState<string>(value || '');
  const debouncedSearchTerm = useDebounce(searchInput, 300);

  const handleInputChange = (val: string) => {
    setSearchInput(val);

    if (!val) {
      onRealEstateSelect(null);
      onChange?.('');
    }
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
    showResults && !isLoading && results.length === 0 && debouncedSearchTerm.trim().length >= 2;

  const onOpenChange = (open: boolean) => setIsModalOpen(open);

  useEffect(() => {
    if (selectedRealEstate) {
      setSearchInput('');
    }
  }, [selectedRealEstate]);

  useEffect(() => {
    if (debouncedSearchTerm.trim().length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }
    setIsLoading(true);
    searchRealEstates({ query: debouncedSearchTerm, limit: 5 })
      .then((searchResults) => {
        setResults(searchResults);
        setShowResults(true);
      })
      .catch(() => {
        setResults([]);
        setShowResults(false);
      })
      .finally(() => setIsLoading(false));
  }, [debouncedSearchTerm]);

  return {
    value: searchInput,
    handleInputChange,
    setIsFocused,
    setShowResults,
    isFocused,
    showResults,
    isLoading,
    results,
    handleRealEstateClick,
    shouldShowNoResults,
    debouncedSearchTerm,
    handleCreateNew,
    isModalOpen,
    onOpenChange,
    clearSelection,
  };
};
