import { PagesUrls } from '@/enums';
import type { ReviewFormData } from '@/types';
import { redirect } from 'next/navigation';
import { useForm } from 'react-hook-form';
import type { FilterChangeParams } from './types';

export const usePropertyFilters = () => {
  const { control } = useForm<ReviewFormData>({
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      rating: 0,
      address_text: '',
      real_estate_id: undefined,
      review_rooms: [],
    },
  });
  const handleFilterChange = ({ osmId }: FilterChangeParams) => {
    if (!osmId) return;
    redirect(`${PagesUrls.ADDREES_DETAILS}/${osmId}`);
  };

  return {
    control,
    handleFilterChange,
  };
};
