import { Dispatch, SetStateAction } from 'react';
import { FieldValues, UseFormReturn } from 'react-hook-form';
import { AsyncSearchSelectClassNameProps } from '../../AsyncSearchSelect/types';
import { type NominatimEntity } from '@/modules/addresses';

export interface AddressSearchInputProps<T extends FieldValues = FieldValues> {
  form: UseFormReturn<T>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  handleClear: () => void;
  name: string;
  queryValue: string;
  onSelect: (item: NominatimEntity) => void;
  placeholder: string;
  label?: string;
  className?: AsyncSearchSelectClassNameProps;
}
