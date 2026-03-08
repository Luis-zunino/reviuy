'use client';

import type { AddressSearchInputProps } from './types';
import { useAddressSearchInput } from './hooks';
import { AsyncSearchSelect } from '../AsyncSearchSelect';
import { FieldValues, Path } from 'react-hook-form';
import { NominatimEntity } from '@/types';

/**
 * Componente que muestra un buscador de direcciones
 * @param <T>
 * @param props Propiedades del componente de buscador de direcciones
 *
 * @returns {JSX.Element}
 */
export const AddressSearchInput = <T extends FieldValues>(props: AddressSearchInputProps<T>) => {
  const {
    setOpen,
    queryValue,
    name,
    form,
    open,
    handleClear,
    onSelect,
    placeholder,
    label,
    className,
  } = props;
  const { data, isLoading } = useAddressSearchInput({ queryValue });

  return (
    <div className="relative w-full">
      <AsyncSearchSelect<T, NominatimEntity & { id: string; name: string }>
        name={name as Path<T>}
        options={data?.map((item) => ({
          ...item,
          id: item.osm_id.toString(),
          name: item.display_name,
        }))}
        isFetching={isLoading}
        open={open}
        setOpen={setOpen}
        form={form}
        handleClear={handleClear}
        onSelect={onSelect}
        placeholder={placeholder}
        label={label}
        className={className}
      />
    </div>
  );
};
