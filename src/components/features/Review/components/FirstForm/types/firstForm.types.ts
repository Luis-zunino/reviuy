import type { Control, FieldErrors } from 'react-hook-form';
import type { ReviewFormData, SelectedAddress } from '@/types';

export interface FirstFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<ReviewFormData, any, ReviewFormData>;
  errors: FieldErrors<ReviewFormData>;
  selectedAddress: SelectedAddress | null;
  handleAddressSelect: (addressData: SelectedAddress) => void;
}
