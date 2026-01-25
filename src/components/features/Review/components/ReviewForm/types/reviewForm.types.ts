import type {
  FieldArrayWithId,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFieldArrayReplace,
  UseFormHandleSubmit,
  UseFormReturn,
} from 'react-hook-form';
import type { NominatimEntity, RealEstate } from '@/types';
import { Dispatch, SetStateAction } from 'react';
import { FormReviewSchema } from '../../../constants';

export interface ReviewFormProps {
  isLoading?: boolean;
  fields: FieldArrayWithId<FormReviewSchema, 'review_rooms', 'id'>[];
  replace: UseFieldArrayReplace<FormReviewSchema, 'review_rooms'>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<FormReviewSchema, any, FormReviewSchema>;
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
  onSelectRealEstate: (item: RealEstate) => void;
  queryValueRealEstate?: string;
}
