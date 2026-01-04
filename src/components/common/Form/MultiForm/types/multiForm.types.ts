import type { UseFormReturn, FieldValues } from 'react-hook-form';
import type { FormEventHandler } from 'react';

export interface MultiFormProps<T extends FieldValues = FieldValues> {
  onSubmit: FormEventHandler<HTMLFormElement>;
  formsChildren: React.ReactNode[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<T, any, T>;
  stepLabels?: string[];
  showProgressBar?: boolean;
  isSubmitDisabled?: boolean;
}
