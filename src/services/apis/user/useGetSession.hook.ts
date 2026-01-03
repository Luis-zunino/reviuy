import { useQuery } from '@tanstack/react-query';
import { getSession } from './getSession.api';
import { USER_KEYS } from '@/services/constants';

export const useGetSession = () => {
  return useQuery({
    queryKey: [USER_KEYS.useGetSession],
    queryFn: async () => {
      return await getSession();
    },
  });
};
