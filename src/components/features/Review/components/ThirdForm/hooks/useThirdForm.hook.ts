import { PagesUrls } from '@/enums';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useDebounce } from '@/hooks';
import { useSearchRealEstates } from '@/services';

export const useThirdForm = (props: { queryValue?: string }) => {
  const { queryValue } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const handleCreateNew = (isModal?: boolean) => {
    if (isModal) {
      setIsModalOpen(true);
      return;
    }
    router.push(PagesUrls.REAL_ESTATE_CREATE);
  };

  const debouncedSearchTerm = useDebounce(queryValue, 300);
  const { data, isLoading } = useSearchRealEstates({
    query: debouncedSearchTerm ?? '',
  });

  const showModal = useMemo(
    () => Boolean(data?.length === 0 && queryValue && queryValue?.length >= 3),
    [data?.length, queryValue]
  );

  return {
    isModalOpen,
    setIsModalOpen,
    handleCreateNew,
    data,
    isLoading,
    showModal,
  };
};
