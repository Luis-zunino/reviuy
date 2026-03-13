import { hasUserReportedRealEstate } from './reportRealEstate.api';
import { useAuthMutation } from '../user';
import { useQuery } from '@tanstack/react-query';
import { reportRealEstateAction } from '@/app/_actions/report.actions';

export const useReportRealEstate = () => {
  return useAuthMutation({
    mutationFn: reportRealEstateAction,
  });
};

export const useHasUserReportedRealEstate = (realEstateId?: string) => {
  return useQuery({
    queryKey: ['has-user-reported-real-estate', realEstateId],
    queryFn: () => hasUserReportedRealEstate(realEstateId),
    enabled: !!realEstateId,
    staleTime: 5 * 60 * 1000,
  });
};
