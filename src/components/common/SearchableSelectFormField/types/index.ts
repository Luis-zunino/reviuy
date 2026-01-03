import type { NominatimEntity } from '@/types';
import { Control, FieldPath, FieldValues, RefCallBack, RegisterOptions } from 'react-hook-form';

export interface SearchableSelectProps {
  options: NominatimEntity[];
  value?: NominatimEntity;
  onValueChange?: (value?: string) => void;
  placeholder?: string;
  emptyMessage?: string;
  className?: { inputContainer?: string; input?: string };
  disabled?: boolean;
  name?: string;
  error?: string;
  onBlur?: () => void;
  id?: string;
  onInputChange?: (value?: string) => void;
  handleSelect?: (value: NominatimEntity) => void;
  ref: RefCallBack;
  isLoading?: boolean;
  loadingMessage?: string;
}

export interface FormFieldSelectProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>;
  name: TName;
  label?: string;
  required?: boolean;
  options: NominatimEntity[];
  placeholder?: string;
  emptyMessage?: string;
  error?: string;
  onValueChange?: (value?: string) => void;
  onInputChange?: (value?: string) => void;
  className?: { inputContainer?: string; input?: string };
  isLoading?: boolean;
  loadingMessage?: string;
  rules?: RegisterOptions<TFieldValues, TName>;
}
