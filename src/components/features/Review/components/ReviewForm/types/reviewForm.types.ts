import type {
  Control,
  FieldArrayWithId,
  FieldErrors,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFieldArrayReplace,
  UseFormHandleSubmit,
  UseFormReturn,
} from 'react-hook-form';
import type { ReviewFormData, SelectedAddress } from '@/types';

export interface ReviewFormProps {
  isAuthenticated: boolean;
  userId?: string | null;
  loading: boolean;
  errors: FieldErrors<ReviewFormData>;
  selectedAddress: SelectedAddress | null;
  handleAddressSelect: (addressData: SelectedAddress) => void;
  fields: FieldArrayWithId<ReviewFormData, 'review_rooms', 'id'>[];
  replace: UseFieldArrayReplace<ReviewFormData, 'review_rooms'>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<ReviewFormData, any, ReviewFormData>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<ReviewFormData, any, ReviewFormData>;
  handleSubmit: UseFormHandleSubmit<ReviewFormData, ReviewFormData>;
  onSubmit: (data: ReviewFormData) => void;
  append: UseFieldArrayAppend<ReviewFormData, 'review_rooms'>;
  remove: UseFieldArrayRemove;
  defaultRealEstateId?: string | null;
  hasExistingReview?: boolean;
}
