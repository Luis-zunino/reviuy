import { FieldValues, Path, UseFormReturn } from 'react-hook-form';

export interface AsyncSearchSelectProps<
  T extends FieldValues,
  V extends { id?: string | null; name?: string | null },
> {
  label?: string;
  name: Path<T>;
  form: UseFormReturn<T>;
  options?: V[];
  isFetching?: boolean;
  handleClear: () => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSelect: (item: V) => void;
  placeholder: string;
  description?: string;
  emptyComponent?: React.ReactNode;
  className?: AsyncSearchSelectClassNameProps;
}

export interface AsyncSearchSelectClassNameProps {
  container?: string;
  item?: string;
  input?: string;
  inputContainer?: string;
}
