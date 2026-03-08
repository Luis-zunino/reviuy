'use client';

import { Form } from '@/components/ui/form';
import { FormSearcherAddressHome } from './constants';
import { useSearcherAddressHome } from './hooks';
import { AddressSearchInput } from '@/components/common/AddressSearchInput';

/**
 * Componente que muestra el buscador de direcciones en la landing principal
 *
 * @returns {JSX.Element}
 */
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
          placeholder="Buscá una dirección..."
          className={{
            container: 'w-full',
            input:
              'w-full rounded-lg px-3 py-2 text-foreground outline-none focus-visible:none bg-transparent border-none border-0 shadow-none',
          }}
        />
      </Form>
    </div>
  );
};
