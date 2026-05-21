import { Path } from 'react-hook-form';
import { FormCreateRealEstateSchema } from '@/schemas/real-estate.schema';

export interface UseCreateRealEstateModalProps {
  onOpenChange: (open: boolean) => void;
  name: Path<FormCreateRealEstateSchema>;
  defaultValues: FormCreateRealEstateSchema;
}
