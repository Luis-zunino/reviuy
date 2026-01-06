import { USER_KEYS } from '@/services/constants';
import { AuthError } from '@supabase/supabase-js';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { verifyAuthentication, VerifyAuthenticationResponse } from './verifyAuthentication.api';

export const useVerifyAuthentication = (): UseQueryResult<
  VerifyAuthenticationResponse,
  AuthError | null
> => {
  return useQuery({
    queryKey: [USER_KEYS.useVerifyAuthentication],
    queryFn: verifyAuthentication,
  });
};
