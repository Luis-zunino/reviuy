import { zodResolver } from '@hookform/resolvers/zod';
import { FormRealEstateSchema, formRealEstateSchema } from '@/schemas';
import { useForm } from 'react-hook-form';
import {
  useGetRealEstateById,
  useGetRealEstateReviewById,
} from '@/modules/real-estates/presentation';
import { useParams } from 'next/navigation';

export const useViewRealEstateReview = () => {
  const { realEstateId, reviewId } = useParams<{ realEstateId: string; reviewId: string }>();
  const { data: realEstate, isLoading: isLoadingRealEstate } = useGetRealEstateById(realEstateId);
  const {
    data: review,
    isLoading: isLoadingReview,
    refetch: refetchRealEstateReview,
  } = useGetRealEstateReviewById({ reviewId });

  const form = useForm<FormRealEstateSchema>({
    defaultValues: {
      title: review?.title || '',
      description: review?.description || '',
      rating: review?.rating || 0,
    },
    values: {
      title: review?.title || '',
      description: review?.description || '',
      rating: review?.rating || 0,
    },
    resolver: zodResolver(formRealEstateSchema),
  });

  const handleSubmit = async () => {
    // No-op para readonly
  };

  return {
    form,
    handleSubmit,
    realEstateName: realEstate?.name,
    isLoadingRealEstate,
    isLoadingReview,
    isError: !realEstate || !review,
    review,
    refetchRealEstateReview,
  };
};
