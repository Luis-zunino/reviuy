import type { UseFormReturn } from 'react-hook-form';
import { Dispatch, SetStateAction } from 'react';
import { FormReviewSchema } from '@/schemas';
import { type NominatimEntity } from '@/modules/addresses';

export interface FirstFormProps {
  form: UseFormReturn<FormReviewSchema, undefined, FormReviewSchema>;
  open: boolean;
  queryValue: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
  handleClear: () => void;
  onSelectAddress: (item: NominatimEntity) => void;
}
