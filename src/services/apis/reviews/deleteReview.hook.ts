'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteReview } from './deleteReview.api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { PagesUrls } from '@/enums';
import type { UseDeleteReviewOptions } from './types';
import { useVerifyAuthentication } from '../user';

export const useDeleteReview = (options?: UseDeleteReviewOptions) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data } = useVerifyAuthentication();
  return useMutation({
    mutationFn: (reviewId: string) => deleteReview({ reviewId, userId: data?.userId }),

    onMutate: async (reviewId: string) => {
      toast.loading('Eliminando reseña...', {
        id: `delete-${reviewId}`,
      });
    },

    onSuccess: (data, reviewId) => {
      toast.dismiss(`delete-${reviewId}`);

      if (data.success) {
        toast.success('Reseña eliminada', {
          description: data.message,
        });

        queryClient.invalidateQueries({ queryKey: ['reviews'] });
        queryClient.invalidateQueries({ queryKey: ['latestReviews'] });
        queryClient.invalidateQueries({ queryKey: ['reviewsByAddress'] });

        queryClient.removeQueries({ queryKey: ['review', reviewId] });

        if (options?.onSuccess) {
          options.onSuccess();
        }

        if (options?.redirectToHome) {
          router.push(PagesUrls.HOME);
        }
      } else {
        toast.error('Error al eliminar', {
          description: data.message || 'No se pudo eliminar la reseña',
        });
      }
    },

    onError: (error: Error, reviewId) => {
      toast.dismiss(`delete-${reviewId}`);

      toast.error('Error inesperado', {
        description: 'No se pudo eliminar la reseña. Inténtalo de nuevo.',
      });

      console.error('Error en useDeleteReview:', error);

      if (options?.onError) {
        options.onError(error);
      }
    },
  });
};
