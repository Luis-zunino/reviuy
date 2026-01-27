import { JSX } from 'react';
import { Path } from 'react-hook-form';
import { FormCreateRealEstateSchema } from '../hook/types';

export interface CreateRealEstateModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  showModal?: boolean;
  triggerComponentModal?: () => JSX.Element;
  name: Path<FormCreateRealEstateSchema>;
  defaultValues: FormCreateRealEstateSchema;
}
