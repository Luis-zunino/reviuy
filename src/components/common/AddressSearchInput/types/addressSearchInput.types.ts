import type { Control, RegisterOptions } from 'react-hook-form';
import type { ReviewFormData, SelectedAddress } from '@/types';

export interface AddressSearchInputProps {
  handleOnClick: (data: SelectedAddress) => void;
  name: string;
  control: Control<ReviewFormData>;
  defaultValue?: string | null;
  className?: { inputContainer?: string; input?: string };
  rules?: RegisterOptions<ReviewFormData, keyof ReviewFormData>;
}
