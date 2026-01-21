import { useDebounce } from '@/hooks';
import { useGetAddressListByName } from '@/services';
import type { UseAddressSearchInputProps } from './types';

export const useAddressSearchInput = (props: UseAddressSearchInputProps) => {
  const { queryValue } = props;

  const debouncedSearchTerm = useDebounce(queryValue, 1000);

  const { data, isLoading } = useGetAddressListByName({
    query: debouncedSearchTerm ?? '',
  });

  return {
    data,
    isLoading,
  };
};
