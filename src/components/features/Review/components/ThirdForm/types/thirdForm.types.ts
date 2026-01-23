import type { UseFormReturn } from 'react-hook-form';
import { FormReviewSchema } from '../../../constants';
import { Dispatch, SetStateAction } from 'react';
import { RealEstate } from '@/types';

export interface ThirdFormProps {
  form: UseFormReturn<FormReviewSchema, any, FormReviewSchema>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  handleClear: () => void;
  onSelect: (item: RealEstate) => void;
  queryValue?: string;
}
