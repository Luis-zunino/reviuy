import type { ReviewWithRelations } from '@/types';

export interface UseCreateOrUpdateReviewFormProps {
  isUpdate: boolean;
  defaultValues?: ReviewWithRelations | null;
}
