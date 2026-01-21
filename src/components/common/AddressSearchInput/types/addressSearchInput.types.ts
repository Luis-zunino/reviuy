import { NominatimEntity } from '@/types';
import { Dispatch, SetStateAction } from 'react';
import { FieldValues, UseFormReturn } from 'react-hook-form';

export interface AddressSearchInputProps<T extends FieldValues> {
  form: UseFormReturn<T, any, T>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  handleClear: () => void;
  name: string;
  queryValue: string;
  onSelect: (item: NominatimEntity) => void;
  placeholder: string;
  label?: string;
  className?: { container?: string; item?: string };
}
