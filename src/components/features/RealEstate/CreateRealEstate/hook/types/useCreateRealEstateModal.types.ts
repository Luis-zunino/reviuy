import { Path } from 'react-hook-form';
import { FormCreateRealEstateSchema } from './useCreateRealEstate.types';

export interface UseCreateRealEstateModalProps {
  onOpenChange: (open: boolean) => void;
  name: Path<FormCreateRealEstateSchema>;
  defaultValues: FormCreateRealEstateSchema;
}
