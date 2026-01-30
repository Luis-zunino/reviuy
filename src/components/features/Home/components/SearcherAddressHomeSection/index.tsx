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
          name="address_text"
          form={form}
          onSelect={onSelect}
          placeholder="Busca una direccion..."
          className={{
            container: 'w-3/4 md:w-1/2 mx-auto',
            input:
              'w-full rounded-lg px-3 py-2 text-foreground outline-none focus-visible:none bg-blue-100',
            inputContainer:
              'p-1 rounded-xl bg-linear-to-r from-blue-400 to-purple-600 animate-gradient',
          }}
        />
      </Form>
    </div>
  );
};
