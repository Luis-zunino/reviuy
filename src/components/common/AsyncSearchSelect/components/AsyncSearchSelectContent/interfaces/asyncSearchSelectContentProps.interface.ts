import { ControllerRenderProps, FieldValues, Path } from 'react-hook-form';
import { AsyncSearchSelectClassNameProps } from '../../../types';

export interface AsyncSearchSelectContentProps<
  T extends FieldValues,
  V extends { id?: string | null; name?: string | null },
> {
  field: ControllerRenderProps<T, Path<T>>;
  isDirty: boolean;
  label?: string;
  description?: string;
  options?: V[];
  isFetching?: boolean;
  handleClear: () => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSelect: (item: V) => void;
  placeholder: string;
  emptyComponent?: React.ReactNode;
  className?: AsyncSearchSelectClassNameProps;
  errorMessage?: string;
}
