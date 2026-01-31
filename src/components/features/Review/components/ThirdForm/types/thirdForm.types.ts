import type { UseFormReturn } from 'react-hook-form';
import { FormReviewSchema } from '@/schemas';
import { Dispatch, SetStateAction } from 'react';
import { RealEstateWitheVotes } from '@/types';

export interface ThirdFormProps {
  form: UseFormReturn<FormReviewSchema, any, FormReviewSchema>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  handleClear: () => void;
  onSelect: (item: RealEstateWitheVotes) => void;
  queryValue?: string;
}
