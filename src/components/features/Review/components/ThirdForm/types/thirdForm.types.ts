import type { Control, FieldErrors, UseFormReturn } from 'react-hook-form';
import { FormReviewSchema } from '../../../constants';
import { Dispatch, SetStateAction } from 'react';
import { RealEstate } from '@/types';

export interface ThirdFormProps {
  control: Control<FormReviewSchema, unknown, FormReviewSchema>;
  errors?: FieldErrors<FormReviewSchema>;
  form: UseFormReturn<FormReviewSchema, any, FormReviewSchema>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  handleClear: () => void;
  onSelect: (item: RealEstate) => void;
  placeholder: string;
  label: string;
  description?: string;
  queryValue?: string;
}
