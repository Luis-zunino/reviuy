import { hasUserReportedReview, reportReview } from './reportReview.api';
import { toast } from 'sonner';
import { useAuthMutation } from '../user';
import { useQuery } from '@tanstack/react-query';

/**
 * Hook para reportar una review
 */
export const useReportReview = () => {
  return useAuthMutation({
    mutationFn: reportReview,
    onSuccess: ({ success, message, error }) => {
      if (success) {
        toast.success(message || 'Reporte enviado exitosamente');
      } else {
        toast.error(error || 'Error al enviar el reporte');
      }
    },
    onError: (error) => {
      console.error('Error al reportar review:', error);
      toast.error('Error inesperado al enviar el reporte');
    },
  });
};

/**
 * Hook para verificar si el usuario ya reportó una review
 */
export const useHasUserReportedReview = (reviewId: string) => {
  return useQuery({
    queryKey: ['has-user-reported-review', reviewId],
    queryFn: () => hasUserReportedReview(reviewId),
    enabled: !!reviewId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};
