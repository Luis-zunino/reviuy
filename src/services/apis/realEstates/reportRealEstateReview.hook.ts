import {
  hasUserReportedRealEstateReview,
  reportRealEstateReview,
} from './reportRealEstateReview.api';
import { toast } from 'sonner';
import { useAuthMutation } from '../user';
import { useQuery } from '@tanstack/react-query';

export const useReportRealEstateReview = () => {
  return useAuthMutation({
    mutationFn: reportRealEstateReview,
    onSuccess: ({ success, message, error }) => {
      if (success) {
        toast.success(message || 'Reporte enviado exitosamente');
      } else {
        toast.error(error || 'Error al enviar el reporte');
      }
    },
    onError: (error) => {
      console.error('Error al reportar reseña:', error);
      toast.error('Error inesperado al enviar el reporte');
    },
  });
};

export const useHasUserReportedRealEstateReview = (reviewId: string) => {
  return useQuery({
    queryKey: ['has-user-reported-real-estate-review', reviewId],
    queryFn: () => hasUserReportedRealEstateReview(reviewId),
    enabled: !!reviewId,
    staleTime: 5 * 60 * 1000,
  });
};
