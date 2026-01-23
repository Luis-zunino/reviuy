'use client';

import { Form } from '@/components/ui/form';
import { FormSearcherAddressHome } from './constants';
import { useSearcherAddressHome } from './hooks';
import { AddressSearchInput } from '@/components/common/AddressSearchInput';

export const SearcherAddressHomeSection = () => {
  const { open, setOpen, queryValue, handleClear, form, onSelect } = useSearcherAddressHome();
  return (
    <div className="mx-auto">
      <Form {...form}>
        <AddressSearchInput<FormSearcherAddressHome>
          open={open}
          setOpen={setOpen}
          queryValue={queryValue}
          handleClear={handleClear}
          name={'address_text'}
          form={form}
          onSelect={onSelect}
          placeholder="Busca una direccion..."
          className={{ container: 'w-3/4 md:w-1/2 mx-auto' }}
        />
      </Form>
    </div>
  );
};
