import type { UseFormReturn } from 'react-hook-form';
import type { NominatimEntity } from '@/types';
import { Dispatch, SetStateAction } from 'react';
import { FormReviewSchema } from '../../../constants';

export interface FirstFormProps {
  form: UseFormReturn<FormReviewSchema, any, FormReviewSchema>;
  open: boolean;
  queryValue: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
  handleClear: () => void;
  onSelectAddress: (item: NominatimEntity) => void;
}
