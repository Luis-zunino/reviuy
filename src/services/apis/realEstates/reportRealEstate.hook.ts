import { hasUserReportedRealEstate, reportRealEstate } from './reportRealEstate.api';
import { useAuthMutation } from '../user';
import { useQuery } from '@tanstack/react-query';

export const useReportRealEstate = () => {
  return useAuthMutation({
    mutationFn: reportRealEstate,
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
