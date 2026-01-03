'use client';

import type { ReviewFormData } from '@/types';
import { SearchableSelectFormField } from '../SearchableSelectFormField';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import type { AddressSearchInputProps } from './types';
import { useAddressSearchInput } from './hooks';

export const AddressSearchInput = ({
  name,
  control,
  handleOnClick,
  defaultValue,
  className,
  rules,
}: AddressSearchInputProps) => {
  const { setSearchTerm, defaultValueData, handleSelect, handleClear, isLoading, data } =
    useAddressSearchInput({
      defaultValue,
      handleOnClick,
    });

  return (
    <div className="relative w-full">
      {defaultValueData ? (
        <div className="flex">
          <Input defaultValue={defaultValueData} name={name} readOnly />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 p-0 hover:bg-red-100"
              onClick={handleClear}
            >
              <X className="h-6 w-6 text-red-500" />
            </Button>
          </div>
        </div>
      ) : (
        <SearchableSelectFormField
          control={control}
          name={name as keyof ReviewFormData}
          required
          rules={rules}
          options={data ?? []}
          emptyMessage={isLoading ? 'Buscando...' : 'No se encontraron direcciones.'}
          isLoading={isLoading}
          loadingMessage="Buscando direcciones..."
          onInputChange={setSearchTerm}
          onValueChange={(value) => {
            if (value) {
              const selected = data?.find((r) => r.osm_id.toString() === value);
              if (selected) {
                handleSelect(selected);
              }
            }
          }}
          className={className}
        />
      )}
    </div>
  );
};
