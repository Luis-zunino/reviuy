'use client';

import { usePropertyFilters } from './hooks';
import { AddressSearchInput } from '@/components/common/AddressSearchInput';

export const Filters = () => {
  const { control, handleFilterChange } = usePropertyFilters();

  return (
    <AddressSearchInput
      handleOnClick={handleFilterChange}
      name="address_text"
      control={control}
      className={{ inputContainer: 'w-3/4 lg:w-1/2 mx-auto', input: 'h-14 bg-white' }}
    />
  );
};
