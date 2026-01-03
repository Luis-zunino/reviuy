import { hasUserReportedRealEstate, reportRealEstate } from './reportRealEstate.api';
import { toast } from 'sonner';
import { useAuthMutation } from '../user';
import { useQuery } from '@tanstack/react-query';

export const useReportRealEstate = () => {
  return useAuthMutation({
    mutationFn: reportRealEstate,
    onSuccess: ({ success, message, error }) => {
      if (success) {
        toast.success(message || 'Reporte enviado exitosamente');
      } else {
        toast.error(error || 'Error al enviar el reporte');
      }
    },
    onError: (error) => {
      console.error('Error al reportar inmobiliaria:', error);
      toast.error('Error inesperado al enviar el reporte');
    },
  });
};

export const useHasUserReportedRealEstate = (realEstateId: string) => {
  return useQuery({
    queryKey: ['has-user-reported-real-estate', realEstateId],
    queryFn: () => hasUserReportedRealEstate(realEstateId),
    enabled: !!realEstateId,
    staleTime: 5 * 60 * 1000,
  });
};
