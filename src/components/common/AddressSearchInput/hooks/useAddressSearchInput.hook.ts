import { useDebounce } from '@/hooks';
import { useGetAddressListByName } from '@/services';
import { NominatimEntity } from '@/types';
import { useEffect, useState } from 'react';
import type { UseAddressSearchInputProps } from './types';

export const useAddressSearchInput = (props: UseAddressSearchInputProps) => {
  const { defaultValue, handleOnClick } = props;

  const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined);
  const [defaultValueData, setDefaultValueData] = useState(defaultValue);

  const debouncedSearchTerm = useDebounce(searchTerm, 1000);
  const { data, isLoading, refetch } = useGetAddressListByName({
    query: debouncedSearchTerm ?? '',
  });

  const handleSelect = (address: NominatimEntity) => {
    const { osm_id, osm_type, display_name } = address;
    const osmId = osm_type.charAt(0).toUpperCase() + osm_id.toString();
    setSearchTerm(display_name);
    handleOnClick({
      osmId,
      position: { lat: Number(address.lat), lon: Number(address.lon) },
      display_name,
    });
  };

  const handleClear = () => {
    setSearchTerm('');
    setDefaultValueData(null);
  };

  useEffect(() => {
    if (debouncedSearchTerm) {
      refetch();
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    setSearchTerm(defaultValueData ?? '');
  }, [defaultValueData]);

  return {
    searchTerm,
    setSearchTerm,
    defaultValueData,
    handleSelect,
    handleClear,
    isLoading,
    data,
  };
};
