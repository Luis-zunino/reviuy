'use client';

import { deleteRealEstateReview } from './deleteRealEstateReview.api';
import { toast } from 'sonner';
import { useAuthMutation } from '@/services';
import type { UseDeleteRealEstateReviewOptions } from './types';

export const useDeleteRealEstateReview = (options?: UseDeleteRealEstateReviewOptions) => {
  return useAuthMutation<
    Awaited<ReturnType<typeof deleteRealEstateReview>>,
    Error,
    { reviewId: string }
  >({
    mutationFn: (variables) => deleteRealEstateReview(variables),

    onMutate: async (variables) => {
      toast.loading('Eliminando reseña...', {
        id: `delete-${variables.reviewId}`,
      });
    },

    onSuccess: (data, variables) => {
      toast.dismiss(`delete-${variables.reviewId}`);

      if (data.success) {
        toast.success('Reseña eliminada', {
          description: data.message,
        });

        if (options?.onSuccess) {
          options.onSuccess();
        }
      } else {
        toast.error('Error al eliminar', {
          description: data.message || 'No se pudo eliminar la reseña',
        });
      }
    },

    onError: (error: Error, variables) => {
      toast.dismiss(`delete-${variables.reviewId}`);

      toast.error('Error inesperado', {
        description: 'No se pudo eliminar la reseña. Inténtalo de nuevo.',
      });

      if (options?.onError) {
        options.onError(error);
      }
    },
  });
};
