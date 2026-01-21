import { UseFormReturn } from 'react-hook-form';
import { FormSearcherRealEstate } from './formSearcherRealEstate.type';

export interface RealEstateSidebarProps {
  form: UseFormReturn<FormSearcherRealEstate, any, FormSearcherRealEstate>;
  handleClearFilters: () => void;
}
