import type {
  FieldArrayWithId,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFieldArrayReplace,
  UseFormHandleSubmit,
  UseFormReturn,
} from 'react-hook-form';
import { Dispatch, SetStateAction } from 'react';
import { FormReviewSchema } from '@/schemas';
import { type NominatimEntity } from '@/modules/addresses';
import { type RealEstateWitheVotes } from '@/modules/real-estates';

export interface ReviewFormProps {
  isLoading?: boolean;
  fields: FieldArrayWithId<FormReviewSchema, 'review_rooms', 'id'>[];
  replace: UseFieldArrayReplace<FormReviewSchema, 'review_rooms'>;
  form: UseFormReturn<FormReviewSchema, undefined, FormReviewSchema>;
  handleSubmit: UseFormHandleSubmit<FormReviewSchema, FormReviewSchema>;
  onSubmit: (data: FormReviewSchema) => void;
  append: UseFieldArrayAppend<FormReviewSchema, 'review_rooms'>;
  remove: UseFieldArrayRemove;
  isSubmitDisabled?: boolean;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  queryValue: string;
  handleClearAddress: () => void;
  onSelectAddress: (item: NominatimEntity) => void;
  openRealEstateModal: boolean;
  setOpenRealEstateModal: Dispatch<SetStateAction<boolean>>;
  handleClearRealEstate: () => void;
  onSelectRealEstate: (item: RealEstateWitheVotes) => void;
  queryValueRealEstate?: string;
}
